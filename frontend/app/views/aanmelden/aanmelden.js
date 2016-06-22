'use strict';

angular.module('catharijne.aanmelden', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/aanmelden', {
		templateUrl: 'views/aanmelden/aanmelden.html'
	});
}])
