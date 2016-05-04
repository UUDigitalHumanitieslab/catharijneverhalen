'use strict';

describe('catharijne.menu module', function() {
	beforeEach(module('catharijne.menu'));
	
	describe('MenuStatus controller', function() {
		beforeEach(inject(function($controller, $rootScope) {
			this.scope = $rootScope.$new();
			this.ctrl = $controller('MenuStatus', {$scope: this.scope});
		}));
		
		it('initially sets the menu closed status', function() {
			expect(this.scope.menuOpen).toBeFalse;
			expect(this.scope.menuDisplayClass).toBe('');
		});
		
		describe('openMenu function', function() {
			it('sets the menu open status', function() {
				this.scope.closeMenu();
				this.scope.openMenu();
				expect(this.scope.menuOpen).toBeTrue;
				expect(this.scope.menuDisplayClass).toBe('menu-open');
			});
		});
		
		describe('closeMenu function', function() {
			it('sets the menu closed status', function() {
				this.scope.openMenu();
				this.scope.closeMenu();
				expect(this.scope.menuOpen).toBeFalse;
				expect(this.scope.menuDisplayClass).toBe('');
			});
		});
		
		describe('toggleMenu function', function() {
			it('alternates between open and closed status', function() {
				expect(this.scope.menuOpen).toBeFalse;
				expect(this.scope.menuDisplayClass).toBe('');
				this.scope.toggleMenu();
				expect(this.scope.menuOpen).toBeTrue;
				expect(this.scope.menuDisplayClass).toBe('menu-open');
				this.scope.toggleMenu();
				expect(this.scope.menuOpen).toBeFalse;
				expect(this.scope.menuDisplayClass).toBe('');
				this.scope.toggleMenu();
				expect(this.scope.menuOpen).toBeTrue;
				expect(this.scope.menuDisplayClass).toBe('menu-open');
			});
		});
	});
});
