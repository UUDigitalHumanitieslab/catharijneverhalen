'use strict';

angular.module('catharijne.googleMaps', ['catharijne.googleMaps.apiKey', 'uiGmapgoogle-maps'])

.config(['appGmapiKey', 'uiGmapGoogleMapApiProvider', function(appGmapiKey, uiGmapGoogleMapApiProvider) {
	uiGmapGoogleMapApiProvider.configure({
		key: appGmapiKey,
		libraries: 'drawing'
	});
}]);
