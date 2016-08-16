'use strict';

describe('catharijne.googleMaps module', function() {
	var gmap;
	
	beforeEach(function() {
		angular.module('testAssist', ['uiGmapgoogle-maps'])
		.config(function(uiGmapGoogleMapApiProvider) {
			gmap = uiGmapGoogleMapApiProvider;
			spyOn(gmap, 'configure');
		});
		module('testAssist');
		module('catharijne.googleMaps');
		inject();
	});
	
	it('configures google maps using the API key', inject(function(appGmapiKey) {
		expect(gmap.configure).toHaveBeenCalledWith({
			key: appGmapiKey,
			libraries: 'drawing'
		});
	}));
});
