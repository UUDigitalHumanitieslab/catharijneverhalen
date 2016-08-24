'use strict';

describe('catharijne.location', function() {
	beforeEach(module('catharijne.location'));
	
	describe('appLocation', function() {
		beforeEach(module('templates'));
		
		it('renders a figure with map, marker and caption', function() {
			inject(function($rootScope, $compile, uiGmapGoogleMapApi) {
				var scope = $rootScope.$new();
				scope.map = {
					coords: {longitude: 4, latitude: 52},
					zoom: 10,
					id: 0,
					label: 'Somewhere near the Netherlands'
				}
				var element = $compile(
					'<app-location properties=map></app-location>'
				)(scope);
				scope.$digest();
				uiGmapGoogleMapApi.then(function(maps) {
					expect(element.children().length).toBe(2);
					var map = $(element.children()[0]);
					var caption = $(element.children[1]);
					expect(map.hasClass('ui-gmap-google-map')).toBeTruthy();
					expect(map.html()).toContain(scope.label);
					expect(caption.text()).toBe(scope.label);
				});
			});
		});
	});
});
