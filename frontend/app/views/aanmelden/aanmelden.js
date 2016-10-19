'use strict';

angular.module('catharijne.aanmelden', ['ngRoute', 'catharijne.user'])

.config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/aanmelden', {
		templateUrl: 'views/aanmelden/aanmelden.html',
		controller: 'RegisterCtrl',
	});
}])

.controller('RegisterCtrl', ['$scope', 'user', function($scope, user) {
	$scope.credentials = {};
	$scope.register = function register(credentials) {
		user.register(credentials);
	};
}]);
