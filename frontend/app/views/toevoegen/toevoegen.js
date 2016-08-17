'use strict';

angular.module('catharijne.toevoegen', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/toevoegen', {
		templateUrl: 'views/toevoegen/toevoegen.html'
	});
}]);
