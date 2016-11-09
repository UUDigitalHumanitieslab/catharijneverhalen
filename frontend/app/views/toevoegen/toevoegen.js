'use strict';

angular.module('catharijne.toevoegen', [
	'ngRoute',
	'catharijne.story',
	'catharijne.objectPicker',
	'catharijne.authRedirect',
	'catharijne.attachmentManager',
	'catharijne.resource',
]).config(['$routeProvider', 'authGuard', function($routeProvider, authGuard) {
	$routeProvider.when('/toevoegen/:pk?', {
		templateUrl: 'views/toevoegen/toevoegen.html',
		controller: 'StoryFormCtrl',
		resolve: {redirection: authGuard},
	});
}]).controller('StoryFormCtrl', [
	'$scope', '$routeParams', '$location',
	'story', 'imageAttachment', 'urlAttachment', 'wrapWithResource',
	function storyFormController(
		$scope, $routeParams, $location,
		story, imageAttachment, urlAttachment, wrapWithResource
	) {
		function passUrlToAttachments() {
			$scope.images.meta.defaults.story = $scope.story.url;
			$scope.links.meta.defaults.story = $scope.story.url;
		}
		function initDetails(storyInstance) {
			$scope.images.items = _.map(
				$scope.story.image_attachments,
				_.partial(wrapWithResource, _, imageAttachment)
			);
			$scope.links.items = _.map(
				$scope.story.url_attachments,
				_.partial(wrapWithResource, _, urlAttachment)
			);
			passUrlToAttachments();
		}
		var storyPk = $routeParams.pk;
		if (storyPk) {
			$scope.story = story.get({pk: storyPk});
			$scope.story.$promise.then(initDetails);
		} else {
			$scope.story = new story();
			$scope.story.subject = $routeParams.subject;
			// Save the empty story to the server so it has a URL.
			var stopListening = $scope.$watch('form.content', function initialSave(newValue) {
				if (newValue !== undefined) {
					// The last NgModelController of the scope was instantiated.
					// This ensures that all required fields are serialized.
					$scope.story.$save().then(passUrlToAttachments);
					stopListening();
				}
			});
		}
		function storySaveSuccess(instance) {
			$location.path('/herinnering/' + instance.pk);
		}
		function storySaveFail(xhr) {
			switch (xhr.status) {
			case 400:
				$scope.serverRemarks = xhr.data;
				break;
			case 401:
				$scope.serverUnauthenticated = true;
				break;
			case 403:
				$scope.serverUnauthorized = true;
				break;
			default:
				$scope.otherServerError = xhr;
			}
			$scope.pending = false;
		}
		$scope.saveStory = function saveStory() {
			$scope.serverRemarks = false;
			$scope.serverUnauthenticated = false;
			$scope.serverUnauthorized = false;
			$scope.otherServerError = false;
			$scope.pending = true;
			if ($scope.story.url) {
				$scope.story.$update().then(storySaveSuccess, storySaveFail);
			} else {
				$scope.story.$save().then(storySaveSuccess, storySaveFail);
			}
		};
		$scope.images = {
			meta: {
				multipart: true,
				title: 'Foto’s',
				info: 'Hier kunt u eigen foto’s toevoegen aan uw herinnering.',
				request: {
					createParams: _.noop,
					updateParams: _.noop,
					deleteParams: _.noop,
				},
				resource: imageAttachment,
				identifier: 'pk',
				defaults: {},
			},
			fields: [
				{
					type: 'file',
					name: 'attachment',
					accept: 'image/*,.jpg,.jpeg,.png,.gif',
					required: true,
				},
			],
			items: [],
		};
		$scope.links = {
			meta: {
				title: 'Links',
				info: 'Hier kunt u externe links toevoegen, bijvoorbeeld naar een opname van uw verhaal op YouTube of SoundCloud.',
				request: $scope.images.meta.request,
				resource: urlAttachment,
				identifier: 'pk',
				defaults: {},
			},
			fields: [
				{
					type: 'url',
					name: 'attachment',
					maxlength: 254,
					placeholder: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
					required: true,
				},
			],
			items: [],
		};
	},
]);
