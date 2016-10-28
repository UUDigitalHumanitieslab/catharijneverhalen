'use strict';

angular.module('catharijne.herinneringofprofiel', [
	'ngRoute',
	'catharijne.authRedirect',
]).config([
	'$routeProvider', 'authGuard',
	function($routeProvider, authGuard) {
		$routeProvider.when('/herinneringofprofiel', {
			templateUrl: 'views/herinneringofprofiel/herinneringofprofiel.html',
			resolve: {redirect: authGuard},
		});
	},
]);
