'use strict';

injectorFix.describe('catharijne.locationPicker module', function() {
	var scope;
	var priorLocation = {
		coords: {latitude: 0, longitude: 0},
		zoom: 7,
		id: 0,
		label: 'Golf van Guinee'
	};
	var clickEventMock = [  // mimics google.maps.MouseEvent
		{latLng: {
			// coordinates chosen to be different from the
			// defaults, but still visible on the map
			lat: function(){return 52.3;},
			lng: function(){return 5.4;}
		}}
	];
	var dragEventMock = {  // mimics google.maps.Map
		getCenter: function() { return {
			lat: function(){return 60;},
			lng: function(){return 10;}
		}; }
	};
	var zoomEventMock = {  // mimics google.maps.Map
		getZoom: function() { return 2; }
	};

	beforeEach(inject(function($rootScope) {
		scope = $rootScope.$new();
	}));
	
	describe('LocationPickerCtrl controller', function() {
		var controller;
		
		beforeEach(inject(function($controller) {
			scope.location = {};
			controller = $controller('LocationPickerCtrl', {$scope: scope});
		}));
		
		it('has a handle for getting hold of google.maps objects', function() {
			expect(scope.handle).toBeDefined();
		});
		
		it('defines active/inactive logic on the scope', function() {
			expect(scope.active).toBe(false);
			expect(scope.activate).toEqual(jasmine.any(Function));
			scope.activate();
			expect(scope.active).toBe(true);
			scope.deactivate();
			expect(scope.active).toBe(false);
		});
		
		it('uses the prior location when available', inject(function($controller) {
			_.assign(scope.location, priorLocation);
			controller = $controller('LocationPickerCtrl', {$scope: scope});
			expect(scope.center).toEqual(priorLocation.coords);
			expect(scope.zoom).toEqual(priorLocation.zoom);
			expect(scope.has_picked).toBe(true);
		}));
		
		it('uses the Netherlands as a fallback location', function() {
			inject(function(locationDefaults) {
				expect(scope.center).toEqual(locationDefaults.coords);
				expect(scope.zoom).toEqual(locationDefaults.zoom);
				expect(scope.has_picked).toBe(false);
			});
		});
		
		it('updates on map click events', inject(function(locationDefaults) {
			scope.zoom = 10;
			scope.mapEvents.click(null, null, clickEventMock);
			expect(scope.center).toEqual(locationDefaults.coords);
			expect(scope.location.coords).toEqual({
				latitude: 52.3,
				longitude: 5.4
			});
			expect(scope.location.zoom).toBe(10);
			expect(scope.has_picked).toBe(true);
		}));
		
		it('updates on map drag events', inject(function(locationDefaults) {
			scope.mapEvents.center_changed(dragEventMock, null);
			expect(scope.center).toEqual({
				latitude: 60,
				longitude: 10
			});
			expect(scope.has_picked).toBe(false);
			expect(scope.location.coords).not.toBeDefined();
		}));
		
		it('updates on map zoom events', inject(function(locationDefaults) {
			scope.mapEvents.zoom_changed(zoomEventMock, null);
			expect(scope.zoom).toBe(2);
			expect(scope.has_picked).toBe(false);
			expect(scope.location.zoom).not.toBeDefined();
		}));
		
		it('updates on marker click events', inject(function(locationDefaults) {
			scope.mapEvents.click(null, null, clickEventMock);
			// now it has a marker
			scope.markerEvents.click(null, null, null, clickEventMock);
			// now it should be removed again
			expect(scope.has_picked).toBe(false);
			expect(scope.center).toEqual(locationDefaults.coords);
			expect(scope.location.coords).not.toBeDefined();
			expect(scope.location.zoom).not.toBeDefined();
		}));
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
			
			it('shows a button for choosing a location', function() {
				expect(button.length).toBe(1);
				expect(button.text()).toBe('Kies een locatie');
			});
			
			it('opens a larger map when clicked', function() {
				button.triggerHandler('click');
				expect(getChild('button').length).toBe(0);
				map = getChild('ui-gmap-google-map');
				expect(map.length).toBe(1);
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
					childScope.mapEvents.click(null, null, clickEventMock);
					var marker = getChild('.angular-google-map-marker');
					expect(marker.length).toBe(1);
				}));
			});
		});
		
		describe('with a prior location', function() {
			var widget, childScope, map;
			
			beforeEach(function() {
				scope.map = new Object(priorLocation);
				element = elementFunc(scope);
				scope.$digest();
				widget = getChild('.app-location');
				childScope = widget.scope();
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
		
		describe('the map', function() {
			var button, childScope, map;
			
			beforeEach(function() {
				element = elementFunc(scope);
				scope.$digest();
				button = getChild('button');
				childScope = button.scope();
				button.triggerHandler('click');
				map = getChild('ui-gmap-google-map');
				// map exists, as proven by previous tests
			});
			
			it('has controls', function() {
				expect(getChild('ui-gmap-map-control').length).toBe(1);
				// The transcluded control templates are not instantiated
				// because of nested layers of promises in uiGmapControl that
				// are difficult to mock.
				// For lack of an actual test, the controls are listed below:
				// 1. the .close-button
			});
			
			it('can be closed', function() {
				// Ideally this is triggered by clicking the .close-button.
				childScope.deactivate();
				expect(getChild('ui-gmap-google-map').length).toBe(0);
			});
		});
		
		describe('the marker', function() {
			var button, childScope, marker;
			
			beforeEach(function() {
				element = elementFunc(scope);
				scope.$digest();
				button = getChild('button');
				childScope = button.scope();
				button.triggerHandler('click');
				// now there is a map
				childScope.mapEvents.click(null, null, clickEventMock);
				marker = getChild('.angular-google-map-marker');
				// marker exists, as proven by previous tests
			});
			
			it('can be removed by clicking it', function() {
				childScope.markerEvents.click();
				expect(getChild('.angular-google-map-marker').length).toBe(0);
			});
		});
	});
});
