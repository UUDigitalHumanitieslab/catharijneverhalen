'use strict';

angular.module('catharijne.profiel', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/profiel/:profileId?', {
		templateUrl: 'views/profiel/profiel.html',
		controller: 'ProfileCtrl'
	});
}])

.controller('ProfileCtrl', ['$routeParams', '$scope', function($routeParams, $scope) {
	this.profileId = $routeParams.profileId;
	
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
}]);
