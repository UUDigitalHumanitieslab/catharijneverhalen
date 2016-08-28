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
		var scope, elementFunc, element;
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
		
		describe('by default', function() {
			beforeEach(function() {
				element = elementFunc(scope);
				scope.$digest();
			});
			
			it('uses the Netherlands as a backup location', function() {
				inject(function(locationDefaults) {
					expect(scope.map).toEqual(locationDefaults);
					var childScope = getChild().scope();
					expect(childScope.location).toEqual(locationDefaults);
				});
			});
			
			it('shows a button for choosing a location', function() {
				var button = element.find('button');
				expect(button.length).toBe(1);
				expect(button.text()).toBe('Kies een locatie');
			});
			
			it('opens a larger map when clicked', function() {
				var button = getChild('button');
				button.triggerHandler('click');
				expect(getChild('button').length).toBe(0);
				var map = getChild('ui-gmap-google-map');
				expect(map.length).toBe(1);
				expect(map.scope().active).toBe(true);
			});
			
			it('does not display a marker initially', function() {
				var button = getChild('button');
				var subScope = button.scope();
				button.triggerHandler('click');
				inject(function(uiGmapGoogleMapApi) {
					uiGmapGoogleMapApi.then(function(gMapsApi) {
						expect(subScope.handle.getGMap).toBeDefined();
						expect(subScope.handle.getGMarkers).not.toBeDefined();
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
			});
			
			it('uses the prior location', function() {
				expect(getChild().scope().location).toEqual(priorLocation);
				expect(scope.map).toEqual(priorLocation);
			});
			
			it('shows the location', function() {
				var widget = getChild('.app-location');
				expect(widget.length).toBe(1);
				var subWidget = angular.element(widget.children()[0]);
				expect(subWidget.scope().properties).toEqual(priorLocation);
			});
			
			it('does display a marker initially', function() {
				var button = getChild('button');
				var subScope = button.scope();
				button.triggerHandler('click');
				inject(function(uiGmapGoogleMapApi) {
					uiGmapGoogleMapApi.then(function(gMapsApi) {
						expect(subScope.handle.getGMarkers).toBeDefined();
						expect(subScope.handle.getGMarkers().length).toBe(1);
					});
				});
			});
		});
	});
});
