'use strict';

angular.module('catharijne.profiel', [
	'ngRoute',
	'catharijne.user',
	'catharijne.person',
	'catharijne.profiel.bewerken',
]).config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/profiel/:username?', {
		templateUrl: 'views/profiel/profiel.html',
		controller: 'ProfileCtrl',
	});
}]).controller('ProfileCtrl', [
	'$routeParams', '$scope', 'user', 'person',
	'genders', 'extractPk',
	function profileController(
		$routeParams, $scope, user, person,
		genders, extractPk
	) {
		function initScope(userInstance) {
			var username = $routeParams.username || userInstance.username;
			if (username === userInstance.username) {
				$scope.self = person.get({pk: extractPk(userInstance.person)});
			}
			$scope.username = username;
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
