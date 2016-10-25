'use strict';

angular.module('catharijne.profiel', [
	'ngRoute',
	'catharijne.user',
	'catharijne.person',
]).config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/profiel/:username?', {
		templateUrl: 'views/profiel/profiel.html',
		controller: 'ProfileCtrl',
	});
}]).controller('ProfileCtrl', [
	'$routeParams', '$scope',
	function profileController($routeParams, $scope) {
		var username = $routeParams.username || user.identity.username;
		if (username && username === user.identity.username) {
			
		}
	
		$scope.storiesPreview = {
			title: 'Mijn verhalen',
			imageUrl: 'verhalenvoorbeeld.jpg',
			href: '/profiel',
			linkText: 'Bewerk',
		};
		$scope.collectionsPreview = {
			title: 'Mijn collecties',
			imageUrl: 'collectiesvoorbeeld.jpg',
			href: '/profiel',
			linkText: 'Bewerk',
		};
	},
]);
