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
					expect(
						angular.element(element.children()[0]).scope().location
					).toEqual(locationDefaults);
				});
			});
			
			it('shows a button for choosing a location', function() {
				var button = element.find('button');
				expect(button).toBeDefined();
				expect(button.text()).toBe('Kies een locatie');
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
				expect(
					angular.element(element.children()[0]).scope().location
				).toEqual(priorLocation);
				expect(scope.map).toEqual(priorLocation);
			});
			
			it('shows the location', function() {
				
			});
		});
	});
});
