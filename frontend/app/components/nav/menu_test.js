'use strict';

describe('catharijne.menu module', function() {
	beforeEach(module('catharijne.menu'));
	
	describe('menu service', function() {
		beforeEach(inject(function(menu) {
			this.menu = menu;
		}));
		
		it('initially sets the menu closed status', function() {
			expect(this.menu.menuOpen).toBeFalse;
		});
		
		describe('openMenu function', function() {
			it('sets the menu open status', function() {
				this.menu.closeMenu();
				this.menu.openMenu();
				expect(this.menu.menuOpen).toBeTrue;
			});
		});
		
		describe('closeMenu function', function() {
			it('sets the menu closed status', function() {
				this.menu.openMenu();
				this.menu.closeMenu();
				expect(this.menu.menuOpen).toBeFalse;
			});
		});
		
		describe('toggleMenu function', function() {
			it('alternates between open and closed status', function() {
				expect(this.menu.menuOpen).toBeFalse;
				this.menu.toggleMenu();
				expect(this.menu.menuOpen).toBeTrue;
				this.menu.toggleMenu();
				expect(this.menu.menuOpen).toBeFalse;
				this.menu.toggleMenu();
				expect(this.menu.menuOpen).toBeTrue;
			});
		});
	});
});
