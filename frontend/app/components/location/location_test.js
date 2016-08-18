'use strict';

describe('catharijne.location', function() {
	beforeEach(module('catharijne.location'));
	
	describe('appLocation', function() {
		beforeEach(module('templates'));
		
		it('renders a figure with map, marker and caption', function() {
			inject(function($rootScope, $compile, uiGmapGoogleMapApi) {
				var scope = $rootScope.$new();
				scope.center = {longitude: 4, latitude: 52};
				scope.bounds = {
					northeast: {longitude: 6.5, latitude: 54},
					southwest: {longitude: 1.5, latitude: 50}
				};
				scope.id = 0;
				scope.label = 'Somewhere near the Netherlands';
				var element = $compile(
					'<app-location center=center bounds=bounds id=id label=label></app-location>'
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
