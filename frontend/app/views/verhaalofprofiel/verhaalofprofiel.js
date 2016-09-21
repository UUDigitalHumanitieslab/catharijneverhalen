'use strict';

angular.module('catharijne.verhaalofprofiel', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/verhaalofprofiel', {
		templateUrl: 'views/verhaalofprofiel/verhaalofprofiel.html'
	});
}]);
