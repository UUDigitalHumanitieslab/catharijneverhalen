'use strict';

angular.module('catharijne.googleMaps', ['uiGmapgoogle-maps'])

.config(['$http', '$log', 'uiGmapGoogleMapApiProvider', function($http, $log, uiGmapGoogleMapApiProvider) {
	$http.get('/api/gmapikey').then(function success(response) {
		uiGmapGoogleMapApiProvider.configure({
			key: response.data,
			libraries: 'drawing'
		});
	}, function error(response) {
		$log.debug('fetching gmapikey failed with ' + response.statusText);
	});
}]);
