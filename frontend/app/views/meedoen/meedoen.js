'use strict';

angular.module('catharijne.meedoen', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/meedoen', {
		templateUrl: 'views/meedoen/meedoen.html'
	});
}]);
