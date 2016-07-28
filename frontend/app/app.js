'use strict';

// Declare app level module which depends on views, and components
angular.module('catharijne', [
	'ngRoute',
	'catharijne.version',
	'catharijne.menu',
	'catharijne.block',
	'catharijne.blocklist',
	'catharijne.home',
	'catharijne.meedoen',
	'catharijne.aanmelden',
	'catharijne.inloggen',
	'catharijne.verhaalofprofiel',
	'catharijne.profiel'
]).
config(['$routeProvider', function($routeProvider) {
	$routeProvider.otherwise({redirectTo: '/home'});
}]);
