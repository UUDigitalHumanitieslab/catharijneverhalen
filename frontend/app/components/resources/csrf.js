'use strict';

angular.module('catharijne.csrf', [])
.config(['$httpProvider', function csrfConfig($httpProvider) {
	// Default values of Django middleware.
	$httpProvider.defaults.xsrfCookieName = 'csrftoken';
	$httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
}])
.run(['$http', function csrfMain($http) {
	$http.get('/api/gettoken/');
	// We assume that the CSRF cookie is set correctly after this.
}]);
