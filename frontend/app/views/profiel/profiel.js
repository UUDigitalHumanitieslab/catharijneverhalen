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
			var pk = extractPk(userInstance.person);
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
