'use strict';

angular.module('catharijne.user', ['catharijne.csrf', 'catharijne.resource'])
.factory('user', ['$resource', function createUserService($resource) {
	var User = $resource('/api/users/', {}, {
		login: {
			method: 'post',
			url: '/api/users/login/',
		},
		logout: {
			method: 'post',
			url: '/api/users/logout/',
		},
		activate: {
			method: 'post',
			url: '/api/users/identity/',
		},
	});
	var service = {};
	service.currentUser = User.activate({}, null, function activateFail() {
		service.currentUser = null;
	});
	service.register = function(credentials, success, fail) {
		service.logout(function preRegisterSuccess() {
			service.currentUser = User.save(null, credentials, success, function registerFail(response) {
				service.currentUser = null;
				if (fail) fail(response);
			})
		});
	};
	service.login = function(credentials, success, fail) {
		service.logout(function preLoginSuccess() {
			service.currentUser = User.login(null, credentials, success, function loginFail(response) {
				service.currentUser = null;
				if (fail) fail(response);
			});
		});
	};
	service.logout = function(success) {
		if (service.currentUser !== null) {
			service.currentUser.$promise.then(function preLogoutSuccess() {
				service.currentUser.$logout(null, {}, success);
			});
		} else if (success) success();
	}
	return service;
}]);
