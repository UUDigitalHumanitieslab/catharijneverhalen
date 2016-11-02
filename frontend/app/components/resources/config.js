'use strict';

angular.module('catharijne.resource', ['ngResource', 'catharijne.csrf'])
.config(['$resourceProvider', function resourceConfig($resourceProvider) {
	$resourceProvider.defaults.stripTrailingSlashes = false;
	$resourceProvider.defaults.actions.update = {
		method: 'PUT',
	};
}]).factory('appendTransform', ['$http', function appendTransformService($http) {
	var defaultResponse = $http.defaults.transformResponse;
	var defaultRequest = $http.defaults.transformRequest;
	function append(existing, addition) {
		if (! angular.isArray(existing)) existing = [existing];
		return existing.concat(addition);
	}
	function prepend(existing, addition) {
		if (! angular.isArray(addition)) addition = [addition];
		return addition.concat(existing);
	}
	var service = {};
	service.response = _.bind(append, service, defaultResponse);
	service.request = _.bind(prepend, service, defaultRequest);
	return service;
}]).factory('currentOrigin', [
	'$location',
	function currentOriginFactory($location) {
		var scheme = $location.protocol();
		var host = $location.host();
		var port = $location.port();
		var portPart = (port === 80 || port === 443 ? '' : ':' + port);
		return scheme + '://' + host + portPart;
	},
]).value('extractPk', function extractPk(url) {
	var match = url.match(/\/(\d+)\/$/);
	if (match) return match[1];
}).value('wrapWithResource', function wrapWithResource(item, Resource) {
	var instance = new Resource();
	return _.assign(instance, item);
});
