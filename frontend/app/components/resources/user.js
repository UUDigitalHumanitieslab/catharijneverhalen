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
		identity: {
			method: 'get',
			url: '/api/users/identity/',
		},
	});
	var service = {};
	service.identity = User.identity();
	service.register = function(credentials, success, fail) {
		return service.identity = User.save(null, credentials, success, fail);
	};
	service.login = function(credentials, success, fail) {
		return service.identity = User.login(null, credentials, success, fail);
	};
	service.logout = function(credentials, success, fail) {
		return service.identity = User.logout(null, credentials, success, fail);
	};
	return service;
}]);
