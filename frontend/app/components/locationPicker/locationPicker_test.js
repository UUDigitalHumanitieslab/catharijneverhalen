'use strict';

injectorFix.describe('catharijne.locationPicker module', function() {
	var scope, controller, elementFunc, element, button, widget, childScope, map;

	beforeEach(inject(function($rootScope) {
		scope = $rootScope.$new();
		scope.map = {};
	}));
	
	describe('LocationPickerCtrl controller', function() {
		beforeEach(inject(function($controller) {
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
		}));
		
		afterEach(function() {
			map = undefined;
			childScope = undefined;
			widget = undefined;
			button = undefined;
			element = undefined;
			scope = undefined;
		});
		
		describe('by default', function() {
			beforeEach(function() {
				element = elementFunc(scope);
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
						lat: function(){return 10;},
						lng: function(){return 20;}
					}}]);
					var marker = getChild('.angular-google-map-marker');
					expect(marker.length).toBe(1);
					expect(childScope.center).toEqual(locationDefaults);
					expect(scope.map.coords).toEqual({
						latitude: 10,
						longitude: 20
					});
					expect(childScope.has_picked).toBe(true);
				}));
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
