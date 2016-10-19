'use strict';

angular.module('catharijne.resource', ['ngResource'])
.config(['$resourceProvider', function resourceConfig($resourceProvider) {
	$resourceProvider.defaults.stripTrailingSlashes = false;
	$resourceProvider.defaults.actions.update = {
		method: 'PUT',
	};
}]);
