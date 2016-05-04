'use strict';

/* https://github.com/angular/protractor/blob/master/docs/toc.md */

describe('catharijne app', function() {

	it('should automatically redirect to /view1 when location hash/fragment is empty', function() {
		browser.get('index.html');
		expect(browser.getLocationAbsUrl()).toMatch("/view1");
	});

	describe('view1', function() {
		beforeEach(function() {
			browser.get('index.html#/view1');
		});

		it('should render view1 when user navigates to /view1', function() {
			expect(element.all(by.css('[ng-view] p')).first().getText()).
				toMatch(/partial for view 1/);
		});
	});

	describe('view2', function() {
		beforeEach(function() {
			browser.get('index.html#/view2');
		});

		it('should render view2 when user navigates to /view2', function() {
			expect(element.all(by.css('[ng-view] p')).first().getText()).
				toMatch(/partial for view 2/);
		});
	});
	
	describe('menu', function() {
		beforeEach(function() {
			browser.get('index.html');
		});
		
		it('should be closed initially', function() {
			expect($('.container-nav-search').isDisplayed()).toBe(false);
		});
		
		it('should open, close each time the hamburger is clicked', function() {
			var hamburger = $('.js-togglemenu');
			var menu = $('.container-nav-search');
			hamburger.click();
			expect(menu.isDisplayed()).toBe(true);
			hamburger.click();
			expect(menu.isDisplayed()).toBe(false);
			hamburger.click();
			expect(menu.isDisplayed()).toBe(true);
		});
		
		it('should close on internal navigation', function() {
			$('.js-togglemenu').click();
			browser.setLocation('view2');
			expect($('.container-nav-search').isDisplayed()).toBe(false);
		});
	});

});
