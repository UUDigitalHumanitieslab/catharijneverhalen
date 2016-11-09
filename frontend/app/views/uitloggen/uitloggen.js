'use strict';

angular.module('catharijne.uitloggen', [
	'ngRoute',
	'catharijne.user',
]).config([
	'$routeProvider',
	function logoutConfig($routeProvider) {
		$routeProvider.when('/uitloggen', {
			template: '<h2>U wordt uitgelogd...</h2>',
			resolve: [
				'user', '$routeParams', '$location',
				function logoutRedirect(user, $routeParams, $location) {
					user.logout({});
					user.identity.$promise.then(function logoutResolve() {
						$location.url($routeParams.next || '/home');
					});
				},
			],
		});
	},
]);
