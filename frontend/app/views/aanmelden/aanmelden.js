'use strict';

angular.module('catharijne.aanmelden', ['ngRoute', 'catharijne.user'])

.config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/aanmelden', {
		templateUrl: 'views/aanmelden/aanmelden.html',
		controller: 'RegisterCtrl',
	});
}])

.controller('RegisterCtrl', ['$scope', '$location', 'user', function($scope, $location, user) {
	function registerSuccess() {
		$location.path('/herinneringofprofiel');
	}
	function registerFail(xhrResponse) {
		if (xhrResponse.data.username) $scope.serverRejectedUsername = true;
		if (xhrResponse.data.email) $scope.serverRejectedEmail = true;
		if (xhrResponse.data.password) $scope.serverRejectedPassword = true;
	}
	$scope.credentials = {};
	$scope.register = function register(credentials) {
		$scope.serverRejectedUsername = false;
		$scope.serverRejectedEmail = false;
		$scope.serverRejectedPassword = false;
		user.register(credentials, registerSuccess, registerFail);
	};
}]);
