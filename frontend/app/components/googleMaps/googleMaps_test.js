'use strict';

describe('catharijne.googleMaps module', function() {
	var $httpBackend;
	
	beforeAll(inject(function($injector) {
		$httpBackend = $injector.get('$httpBackend');
	}));
	
	beforeEach(module('uiGmapgoogle-maps'));
	
	describe('config', function() {
		var gmap;
		
		beforeEach(inject(function(uiGmapGoogleMapApiProvider) {
			gmap = uiGmapGoogleMapApiProvider;
			spyOn(gmap.configure);
		}));
	
		it('configures google maps using the API key from the backend', function() {
			$httpBackend.expectGET('/api/gmapikey').respond(200, '12345');
			module('catharijne.googleMaps');
			$httpBackend.flush();
			expect(gmap.configure).toHaveBeenCalledWith({
				key: '12345',
				libraries: 'drawing'
			});
		});
	});
});
