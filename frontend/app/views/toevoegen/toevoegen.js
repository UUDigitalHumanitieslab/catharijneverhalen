'use strict';

angular.module('catharijne.toevoegen', ['ngRoute', 'catharijne.story'])

.config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/toevoegen/:pk?', {
		templateUrl: 'views/toevoegen/toevoegen.html',
		controller: 'StoryFormCtrl'
	});
}])

.controller('StoryFormCtrl', [
	'$scope', '$routeParams', 'story', '$location',
	function storyFormController($scope, $routeParams, story, $location) {
		var storyPk = $routeParams.pk;
		if (storyPk) {
			$scope.story = story.get({pk: storyPk});
		} else {
			$scope.story = new story();
		}
		if (! $scope.story.content) {
			$scope.story.content = 'Beschrijf hier uw herinnering (maximaal 500 woorden). Gebruik witregels om alinea’s te scheiden. Een alinea van minder dan tien woorden wordt weergegeven als een kopje. Voorbeeld:\n\nDit is een alinea van meer dan tien woorden. U sluit deze af met een witregel door twee keer op enter te drukken.\n\nDit wordt een kopje\n\nNa bovenstaande witregel gaat het verhaal weer verder met een alinea van meer dan tien woorden.';
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
	},
]);
