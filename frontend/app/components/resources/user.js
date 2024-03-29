'use strict';

angular.module('catharijne.user', ['catharijne.resource'])
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
		identity: {
			method: 'get',
			url: '/api/users/identity/',
		},
		register: {
			method: 'post',
			url: '/api/users/register/',
		},
	});
	var service = {};
	service.identity = User.identity();
	service.register = function(credentials, success, fail) {
		return service.identity = User.register(null, credentials, success, fail);
	};
	service.login = function(credentials, success, fail) {
		return service.identity = User.login(null, credentials, success, fail);
	};
	service.logout = function(credentials, success, fail) {
		return service.identity = User.logout(null, credentials, success, fail);
	};
	service.whenAuthenticated = function(callback) {
		service.identity.$promise.then(function loginCheck(userInstance) {
			if (userInstance.url) callback(userInstance);
		});
	};
	return service;
}]);
