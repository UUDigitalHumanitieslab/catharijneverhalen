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
		var flushRequests, flushPromises;
		
		beforeEach(inject(function($controller, $rootScope, $httpBackend, currentOrigin) {
			var routeParamsStub1 = jasmine.createSpy('routeParamsStub1');
			var routeParamsStub2 = jasmine.createSpy('routeParamsStub2');
			routeParamsStub2.username = 'me';
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
			$httpBackend.whenGET(
				currentOrigin + '/app/demo_objects.json'
			).respond(204, '');
			$httpBackend.whenGET('/api/gettoken/').respond(204, '');
			$httpBackend.whenGET('/api/users/identity/').respond({
				url: 'http://123.xyz/',
				person: 'http://123.xyz/person/1',
			});
			$httpBackend.whenGET('/api/stories/').respond(404, '');
			$httpBackend.whenGET('/api/persons/').respond(404, '');
			flushRequests = _.bind($httpBackend.flush, $httpBackend);
			flushPromises = _.bind($rootScope.$apply, $rootScope);
		}));
		
		it('stores the profile ID when given on the route', function() {
			flushRequests();
			flushPromises();
			expect(this.controller1).toBeDefined();
			expect(this.scope1.username).toBeUndefined();
			expect(this.controller2).toBeDefined();
			expect(this.scope2.username).toBe('me');
		});
		
		it('defines block items for story and collection previews', function() {
			expect(this.scope1.storiesPreview).toBeDefined();
			expect(this.scope1.collectionsPreview).toBeDefined();
		});
	});
});