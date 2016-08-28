'use strict';

describe('catharijne.locationPicker module', function() {
	beforeEach(module('catharijne.locationPicker'));
	
	describe('LocationPickerCtrl controller', function() {
		var scope, controller;
		
		beforeEach(inject(function($rootScope, $controller) {
			scope = $rootScope.$new();
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
		var scope, elementFunc, element, button, widget, childScope;
		var getChild = function(query) {
			var rawChild;
			if (query) {
				rawChild = element[0].querySelector(query);
			} else {
				rawChild = element.children()[0];
			}
			return angular.element(rawChild);
		};
		
		beforeEach(function() {
			module('templates');
			inject(function($rootScope, $compile) {
				scope = $rootScope.$new();
				elementFunc = $compile(
					'<app-location-picker location=map></app-location-picker>'
				);
			});
		});
		
		afterEach(function() {
			childScope = undefined;
			widget = undefined;
			button = undefined;
			element = undefined;
			scope = undefined;
		});
		
		describe('by default', function() {
			beforeEach(function() {
				element = elementFunc(scope);
				scope.$digest();
				button = getChild('button');
				childScope = button.scope();
			});
			
			it('uses the Netherlands as a backup location', function() {
				inject(function(locationDefaults) {
					expect(scope.map).toEqual(locationDefaults);
					expect(childScope.location).toEqual(locationDefaults);
				});
			});
			
			it('shows a button for choosing a location', function() {
				expect(button.length).toBe(1);
				expect(button.text()).toBe('Kies een locatie');
			});
			
			it('opens a larger map when clicked', function() {
				button.triggerHandler('click');
				expect(getChild('button').length).toBe(0);
				var map = getChild('ui-gmap-google-map');
				expect(map.length).toBe(1);
				expect(map.scope().active).toBe(true);
			});
			
			it('does not display a marker initially', function() {
				button.triggerHandler('click');
				inject(function(uiGmapGoogleMapApi) {
					uiGmapGoogleMapApi.then(function(gMapsApi) {
						expect(childScope.handle.getGMap).toBeDefined();
						expect(childScope.handle.getGMarkers).not.toBeDefined();
					});
				});
			});
		});
		
		describe('with a prior location', function() {
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
			
			it('does display a marker initially', function() {
				widget.triggerHandler('click');
				inject(function(uiGmapGoogleMapApi) {
					uiGmapGoogleMapApi.then(function(gMapsApi) {
						expect(childScope.handle.getGMarkers).toBeDefined();
						expect(childScope.handle.getGMarkers().length).toBe(1);
					});
				});
			});
		});
	});
});
