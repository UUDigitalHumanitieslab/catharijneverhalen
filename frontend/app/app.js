'use strict';

// Declare app level module which depends on views, and components
angular.module('catharijne', [
	'ngRoute',
	'catharijne.menu',
	'catharijne.block',
	'catharijne.blocklist',
	'catharijne.objectPicker',
	'catharijne.version',
	'catharijne.home',
	'catharijne.meedoen',
	'catharijne.aanmelden',
	'catharijne.inloggen',
	'catharijne.verhaalofprofiel',
	'catharijne.profiel',
	'catharijne.toevoegen'
]).
config(['$routeProvider', function($routeProvider) {
	$routeProvider.otherwise({redirectTo: '/home'});
}]);
