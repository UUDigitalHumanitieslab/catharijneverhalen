'use strict';

// Declare app level module which depends on views, and components
angular.module('catharijne', [
	'ngRoute',
	'catharijne.view1',
	'catharijne.view2',
	'catharijne.version',
	'catharijne.menu',
	'catharijne.blocklist',
	'catharijne.home',
	'catharijne.meedoen',
	'catharijne.aanmelden'
]).
config(['$routeProvider', function($routeProvider) {
	$routeProvider.otherwise({redirectTo: '/home'});
}]);
