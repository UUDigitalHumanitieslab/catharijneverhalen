'use strict';

angular.module('catharijne.profiel', [
	'ngRoute',
	'catharijne.user',
	'catharijne.person',
	'catharijne.object',
	'catharijne.story',
	'catharijne.profiel.bewerken',
]).config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/profiel/:username?', {
		templateUrl: 'views/profiel/profiel.html',
		controller: 'ProfileCtrl',
	});
}]).controller('ProfileCtrl', [
	'$routeParams', '$scope', '$q',
	'user', 'person', 'object', 'story', 'genders', 'extractPk',
	function profileController(
		$routeParams, $scope, $q,
		user, person, object, story, genders, extractPk
	) {
		// Predicate on story instances.
		var hasImages = _.overSome(
			_.property('subject'),
			_.property('image_attachments.length')
		);
		// Only invoked on instances that are known to have images.
		function getImage(storyInstance) {
			var deferred = $q.defer();
			if (storyInstance.image_attachments.length > 0) {
				deferred.resolve(_.sample(storyInstance.image_attachments));
			} else {
				object.get({
					url: storyInstance.subject,
				}).$promise.then(function subjectFetch(objectInstance) {
					deferred.resolve('image/' + objectInstance.image);
				});
			}
			return deferred.promise;
		}
		function setImages(storyList) {
			var sample = _(storyList).filter(hasImages).sampleSize(2);
			var promises = sample.map(getImage).value();
			promises[0].then(_.partial(_.set, $scope, 'bannerImage'));
			promises[1].then(
				_.partial(_.set, $scope, 'storiesPreview.imageUrl')
			);
		}
		function initScope(userInstance) {
			var username = $routeParams.username || userInstance.username;
			var pk = extractPk(userInstance.person);
			story.query({author_id: pk}).$promise.then(setImages);
			if (username === userInstance.username) {
				$scope.self = person.get({'pk': pk});
			}
			$scope.username = username;
			$scope.storiesPreview.href = '#/herinneringen?author_id=' + pk;
		}
		user.identity.$promise.then(initScope);
		$scope.storiesPreview = {
			title: 'Herinneringen',
			linkText: 'Bekijk',
		};
		$scope.collectionsPreview = {
			title: 'Collecties',
			linkText: 'Binnenkort',
		};
		$scope.genderFormat = genders;
	},
]);
