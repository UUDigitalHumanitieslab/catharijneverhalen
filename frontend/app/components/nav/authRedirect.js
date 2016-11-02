'use strict';

angular.module('catharijne.authRedirect', [
	'catharijne.user',
]).constant('authGuard', [
	'user', '$location',
	function guard(user, $location) {
		function decideRedirect(userInstance) {
			if (!userInstance.url) {
				$location.replace();
				$location.url('/meedoen?next=' + $location.url());
			}
		}
		return user.identity.$promise.then(decideRedirect);
	},
]);
