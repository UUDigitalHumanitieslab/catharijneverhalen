'use strict';

angular.module('catharijne.toevoegen', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/toevoegen', {
		templateUrl: 'views/toevoegen/toevoegen.html',
		controller: 'StoryFormCtrl'
	});
}])

.controller('StoryFormCtrl', ['$scope', function($scope) {
	$scope.story = {};
	// $scope.map = {
	// 	coords: {latitude: 52, longitude: 4},
	// 	zoom: 10,
	// 	id: 0,
	// 	label: 'probeersel'
	// };
}]);
