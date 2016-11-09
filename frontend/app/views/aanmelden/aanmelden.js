'use strict';

angular.module('catharijne.aanmelden', ['ngRoute', 'catharijne.user'])

.config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/aanmelden', {
		templateUrl: 'views/aanmelden/aanmelden.html',
		controller: 'RegisterCtrl',
	});
}])

.controller('RegisterCtrl', [
	'$scope', '$location', 'user', '$routeParams',
	function($scope, $location, user, $routeParams) {
		function registerSuccess() {
			$location.path($routeParams.next || '/herinneringofprofiel');
		}
		function registerFail(xhrResponse) {
			if (xhrResponse.data.username) $scope.serverRejectedUsername = true;
			if (xhrResponse.data.email) $scope.serverRejectedEmail = true;
			if (xhrResponse.data.password) $scope.serverRejectedPassword = true;
			$scope.pending = false;
		}
		$scope.credentials = {};
		$scope.replaceFrom = /[^a-zA-Z0-9_ ]/g;
		$scope.replaceTo = '\\$&';
		$scope.register = function register(credentials) {
			$scope.serverRejectedUsername = false;
			$scope.serverRejectedEmail = false;
			$scope.serverRejectedPassword = false;
			$scope.pending = true;
			user.register(credentials, registerSuccess, registerFail);
		};
	}
]);
