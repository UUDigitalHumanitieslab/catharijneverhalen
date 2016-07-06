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
		title: 'Verhalen',
		imageUrl: 'verhalenvoorbeeld.jpg',
		href: '/profiel'
	};
	$scope.collectionsPreview = {
		title: 'Collecties',
		imageUrl: 'collectiesvoorbeeld.jpg',
		href: '/profiel'
	};
}]);
