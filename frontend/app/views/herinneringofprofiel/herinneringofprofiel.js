'use strict';

angular.module('catharijne.herinneringofprofiel', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/herinneringofprofiel', {
		templateUrl: 'views/herinneringofprofiel/herinneringofprofiel.html'
	});
}]);
