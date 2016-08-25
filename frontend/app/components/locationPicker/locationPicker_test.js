'use strict';

describe('catharijne.locationPicker module', function() {
	beforeEach(module('catharijne.locationPicker'));
	
	describe('LocationPickerCtrl controller', function() {
		var scope, controller, gmapApi;
		
		beforeEach(inject(function($rootScope, $controller, uiGmapGoogleMapApi) {
			scope = $rootScope.$new();
			controller = $controller('LocationPickerCtrl', {$scope: scope});
			gmapApi = uiGmapGoogleMapApi;
		}));
		
		it('defines active/inactive logic on the scope', function() {
			expect(scope.active).toBe(false);
			expect(scope.activate).toEqual(jasmine.any(Function));
			spyOn(gmapApi, 'then').and.callFake(function(func) {
				func();
			});
			expect(gmapApi.then).not.toHaveBeenCalled();
			scope.activate();
			expect(gmapApi.then).toHaveBeenCalled();
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
					'<app-location-picker ng-model=map></app-location-picker>'
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
				});
			});
			
		});
		
	});
});
