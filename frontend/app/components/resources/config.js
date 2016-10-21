'use strict';

angular.module('catharijne.resource', ['ngResource', 'catharijne.csrf'])
.config(['$resourceProvider', function resourceConfig($resourceProvider) {
	$resourceProvider.defaults.stripTrailingSlashes = false;
	$resourceProvider.defaults.actions.update = {
		method: 'PUT',
	};
}]).service('appendTransform', ['$http', function appendTransformService($http) {
	var defaultResponse = $http.defaults.transformResponse;
	var defaultRequest = $http.defaults.transformRequest;
	function append(existing, addition) {
		if (! angular.isArray(existing)) existing = [existing];
		return existing.concat(addition);
	}
	var service = {};
	service.response = _.bind(append, service, defaultResponse);
	service.request = _.bind(append, service, defaultRequest);
	return service;
}]);
