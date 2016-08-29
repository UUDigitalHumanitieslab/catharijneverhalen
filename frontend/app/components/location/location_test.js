'use strict';

injectorFix.describe('catharijne.location', function() {
	describe('locationDefaults', function() {
		it('contains default center and zoom values for the Netherlands', function() {
			inject(function(locationDefaults) {
				expect(locationDefaults).toBeDefined();
				expect(locationDefaults.coords).toBeDefined();
				expect(locationDefaults.coords.latitude).toEqual(jasmine.any(Number));
				expect(locationDefaults.coords.longitude).toEqual(jasmine.any(Number));
				expect(locationDefaults.zoom).toEqual(jasmine.any(Number));
			});
		});
	});
	
	describe('appLocation', function() {
		it('renders a figure with map, marker and caption', function() {
			inject(function($rootScope, $compile, uiGmapIsReady) {
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
				uiGmapIsReady.promise().then(function() {
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
