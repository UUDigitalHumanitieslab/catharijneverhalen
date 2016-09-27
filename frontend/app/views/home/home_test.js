'use strict';

describe('catharijne.home', function() {
	beforeEach(function() {
		routeFix.captureRouteProvider();
		module('catharijne.home');
	});
	
	routeFix.checkRoute(
		'/home',
		'views/home/home.html',
		'HomeCtrl'
	);
	
	describe('HomeCtrl', function() {
		beforeEach(inject(function($controller, $rootScope) {
			this.scope = $rootScope.$new();
			this.controller = $controller('HomeCtrl', {$scope: this.scope});
		}));
		
		it('exists', function() {
			expect(this.controller).toBeDefined();
		});
		
		it('manages the home class on the body element', function() {
			expect(this.scope.body).toBeDefined();
			expect(this.scope.body.hasClass('home')).toBeTruthy();
			this.scope.$parent.$broadcast('$routeChangeStart');
			expect(this.scope.body.hasClass('home')).toBeFalsy();
		});
		
		it('defines the blocks that should be displayed', function() {
			expect(this.scope.blocks).toBeDefined();
			expect(this.scope.blocks.length).toBe(3);
			expect(this.scope.blocks[0].title).toBeDefined();
			expect(this.scope.blocks[0].href).toBeDefined();
			expect(this.scope.blocks[0].description).toBeDefined();
			expect(this.scope.blocks[0].title).toBe('Herinneringen');
			expect(this.scope.blocks[1].title).toBe('Voorwerpen');
			expect(this.scope.blocks[2].title).toBe('Uitleg en contact');
		});
	});
});