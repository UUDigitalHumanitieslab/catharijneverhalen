'use strict';

angular.module('catharijne.toevoegen', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/toevoegen', {
		templateUrl: 'views/toevoegen/toevoegen.html',
		controller: 'StoryFormCtrl'
	});
}])

.controller('StoryFormCtrl', ['$scope', function($scope) {
	$scope.story = {
		location: {}
	};
}]);
