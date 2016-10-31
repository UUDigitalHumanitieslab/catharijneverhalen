'use strict';

// Declare app level module which depends on views, and components
angular.module('catharijne', [
	'ngRoute',
	'catharijne.menu',
	'catharijne.version',
	'catharijne.home',
	'catharijne.meedoen',
	'catharijne.aanmelden',
	'catharijne.inloggen',
	'catharijne.uitloggen',
	'catharijne.herinneringofprofiel',
	'catharijne.profiel',
	'catharijne.toevoegen',
	'catharijne.herinnering',
	'catharijne.herinneringen',
]).
config(['$routeProvider', function($routeProvider) {
	$routeProvider.otherwise({redirectTo: '/home'});
}]);
