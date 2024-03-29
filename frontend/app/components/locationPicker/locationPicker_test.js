'use strict';

xdescribe('catharijne.locationPicker module', function() {
	var scope;
	var priorLocation = {
		coords: {latitude: 0, longitude: 0},
		zoom: 7,
		id: 0,
		label: 'Golf van Guinee'
	};
	var clickEventMock = [{latLng: {
		// coordinates chosen to be different from the
		// defaults, but still visible on the map
		lat: function(){return 52.3;},
		lng: function(){return 5.4;}
	}}];  // mimics google.maps.MouseEvent

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
		
		it('updates on click events', inject(function(locationDefaults) {
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
	});
	
	describe('appLocationPicker directive', function() {
		var elementFunc, element;
		var getChild = function(query) {
			return domFix.getChild(element, query);
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
	});
});
