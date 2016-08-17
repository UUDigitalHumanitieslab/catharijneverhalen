'use strict';

angular.module('catharijne.inloggen', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/inloggen', {
		templateUrl: 'views/inloggen/inloggen.html'
	});
}]);
