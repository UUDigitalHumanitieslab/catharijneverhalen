'use strict';

injectorFix.describe('catharijne.locationPicker module', function() {
	var scope;

	beforeEach(inject(function($rootScope) {
		scope = $rootScope.$new();
	}));
	
	describe('LocationPickerCtrl controller', function() {
		var controller;
		
		beforeEach(inject(function($controller) {
			scope.location = {};
			controller = $controller('LocationPickerCtrl', {$scope: scope});
		}));
		
		it('defines active/inactive logic on the scope', function() {
			expect(scope.active).toBe(false);
			expect(scope.activate).toEqual(jasmine.any(Function));
			scope.activate();
			expect(scope.active).toBe(true);
		});
	});
	
	describe('appLocationPicker directive', function() {
		var elementFunc, element;
		var getChild = function(query) {
			var rawChild;
			if (query) {
				rawChild = element[0].querySelector(query);
			} else {
				rawChild = element.children()[0];
			}
			return angular.element(rawChild);
		};
		
		beforeEach(inject(function($compile) {
			elementFunc = $compile(
				'<app-location-picker location=map></app-location-picker>'
			);
			scope.map = {};
		}));
		
		describe('by default', function() {
			var button, childScope, map;
			
			beforeEach(function() {
				element = elementFunc(scope);
				scope.$digest();
				button = getChild('button');
				childScope = button.scope();
			});
			
			it('uses the Netherlands as a fallback location', function() {
				inject(function(locationDefaults) {
					expect(childScope.center).toEqual(locationDefaults.coords);
					expect(childScope.zoom).toEqual(locationDefaults.zoom);
				});
			});
			
			it('shows a button for choosing a location', function() {
				expect(button.length).toBe(1);
				expect(button.text()).toBe('Kies een locatie');
			});
			
			it('opens a larger map when clicked', function() {
				button.triggerHandler('click');
				expect(getChild('button').length).toBe(0);
				map = getChild('ui-gmap-google-map');
				expect(map.length).toBe(1);
				expect(map.scope().active).toBe(true);
			});
			
			describe('the open map', function() {
				beforeEach(function() {
					button.triggerHandler('click');
					map = getChild('ui-gmap-google-map');
				});
			
				it('does not display a marker initially', function() {
					var marker = getChild('.angular-google-map-marker');
					expect(marker.length).toBe(0);
				});
				
				it('allows one to place a marker', inject(function(locationDefaults) {
					childScope.mapEvents.click(null, null, [{latLng: {
						// coordinates chosen to be different from the
						// defaults, but still visible on the map
						lat: function(){return 52.3;},
						lng: function(){return 5.4;}
					}}]);
					var marker = getChild('.angular-google-map-marker');
					expect(childScope.center).toEqual(locationDefaults.coords);
					expect(scope.map.coords).toEqual({
						latitude: 52.3,
						longitude: 5.4
					});
					expect(childScope.has_picked).toBe(true);
					expect(marker.length).toBe(1);
				}));
			});
		});
		
		describe('with a prior location', function() {
			var widget, childScope, map;
			var priorLocation = {
				coords: {latitude: 0, longitude: 0},
				zoomlevel: 7,
				id: 0,
				label: 'Golf van Guinee'
			};
			
			beforeEach(function() {
				scope.map = new Object(priorLocation);
				element = elementFunc(scope);
				scope.$digest();
				widget = getChild('.app-location');
				childScope = widget.scope();
			});
			
			it('uses the prior location', function() {
				expect(childScope.location).toEqual(priorLocation);
				expect(scope.map).toEqual(priorLocation);
			});
			
			it('shows the location', function() {
				expect(widget.length).toBe(1);
				var subWidget = angular.element(widget.children()[0]);
				expect(subWidget.scope().properties).toEqual(priorLocation);
			});
			
			describe('the open map', function() {
				beforeEach(function() {
					widget.triggerHandler('click');
					map = getChild('ui-gmap-google-map');
				});
			
				it('does display a marker initially', function() {
					var marker = getChild('.angular-google-map-marker');
					expect(marker.length).toBe(1);
				});
			});
		});
	});
});
