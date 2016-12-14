'use strict';

describe('catharijne.profiel', function() {
	beforeEach(function() {
		routeFix.captureRouteProvider();
		module('catharijne.profiel');
	});
	
	routeFix.checkRoute(
		'/profiel/:username?',
		'views/profiel/profiel.html',
		'ProfileCtrl'
	);
	
	describe('ProfileCtrl', function() {
		beforeEach(inject(function($controller, $rootScope) {
			var routeParamsStub1 = jasmine.createSpy('routeParamsStub1');
			var routeParamsStub2 = jasmine.createSpy('routeParamsStub2');
			routeParamsStub2.profileId = 1;
			this.scope1 = $rootScope.$new();
			this.scope2 = $rootScope.$new();
			this.controller1 = $controller('ProfileCtrl', {
				$scope: this.scope1,
				$routeParams: routeParamsStub1
			});
			this.controller2 = $controller('ProfileCtrl', {
				$scope: this.scope2,
				$routeParams: routeParamsStub2
			});
		}));
		
		it('stores the profile ID when given on the route', function() {
			expect(this.controller1).toBeDefined();
			expect(this.controller1.profileId).toBeUndefined();
			expect(this.controller2).toBeDefined();
			expect(this.controller2.profileId).toBe(1);
		});
		
		it('defines block items for story and collection previews', function() {
			expect(this.scope1.storiesPreview).toBeDefined();
			expect(this.scope1.collectionsPreview).toBeDefined();
		});
	});
});