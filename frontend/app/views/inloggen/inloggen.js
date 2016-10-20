'use strict';

angular.module('catharijne.inloggen', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/inloggen', {
		templateUrl: 'views/inloggen/inloggen.html',
		controller: 'LoginCtrl',
	});
}])

.controller('LoginCtrl', [
	'$scope', '$location', 'user',
	function loginController($scope, $location, user) {
		function loginSuccess() {
			$location.path('/herinneringofprofiel');
		}
		function loginFail(xhrResponse) {
			if (xhrResponse.data.detail) {
				if (xhrResponse.data.detail.match('did not match')) {
					$scope.serverRejectedCredentials = true;
				} else if (xhrResponse.data.detail.match('disabled')) {
					$scope.accountDisabled = true;
				} else {
					$scope.serverMessage = xhrResponse.data.detail;
				}
			} else {
				for (key in xhrResponse.data) {
					$scope.serverMessage += xhrResponse.data[key] + ' ';
				}
			}
			$scope.pending = false;
		}
		$scope.credentials = {};
		$scope.login = function(credentials) {
			user.login(credentials, loginSuccess, loginFail);
			$scope.serverMessage = '';
			$scope.serverRejectedCredentials = false;
			$scope.accountDisabled = false;
			$scope.pending = true;
		}
	},
]);
