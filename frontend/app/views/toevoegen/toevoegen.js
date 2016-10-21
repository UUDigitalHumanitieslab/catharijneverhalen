'use strict';

angular.module('catharijne.toevoegen', ['ngRoute', 'catharijne.story'])

.config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/toevoegen/:pk?', {
		templateUrl: 'views/toevoegen/toevoegen.html',
		controller: 'StoryFormCtrl'
	});
}])

.controller('StoryFormCtrl', [
	'$scope', '$routeParams', 'story',
	function storyFormController($scope, $routeParams, story) {
		var storyPk = $routeParams.pk;
		if (storyPk) {
			$scope.story = story.get({pk: storyPk});
			$scope.story.$promise.then(function fetchSuccess(instance) {
				if (instance.year && instance.year_end) {
					instance.year = [instance.year,instance.year_end].join('-');
				}
			});
		} else {
			$scope.story = new story();
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
			var years = $scope.story.year.match(/(\d{4})-(\d{4})/);
			if (years) {
				$scope.story.year = Number(years[1]);
				$scope.story.year_end = Number(years[2]);
			}
			if ($scope.story.url) {
				$scope.story.$update().catch(storySaveFail);
			} else {
				$scope.story.$save().catch(storySaveFail);
			}
		};
	},
]);
