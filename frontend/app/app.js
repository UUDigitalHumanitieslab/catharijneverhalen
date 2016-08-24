'use strict';

// Declare app level module which depends on views, and components
angular.module('catharijne', [
	'ngRoute',
	'catharijne.menu',
	'catharijne.block',
	'catharijne.blocklist',
	'catharijne.version',
	'catharijne.googleMaps',
	'catharijne.location',
	'catharijne.locationPicker',
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
