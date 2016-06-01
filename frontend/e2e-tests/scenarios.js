'use strict';

/* https://github.com/angular/protractor/blob/master/docs/toc.md */

describe('catharijne app', function() {

	it('should automatically redirect to /view1 when location hash/fragment is empty', function() {
		browser.get('index.html');
		expect(browser.getLocationAbsUrl()).toMatch("/home");
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
			var hamburger = $('.hamburger .wrapper');
			var menu = $('.container-nav-search');
			hamburger.click();
			browser.sleep(500);  // give the opening animation some time
			expect(menu.isDisplayed()).toBe(true);
			hamburger.click();
			browser.sleep(500);  // give the closing animation some time
			expect(menu.isDisplayed()).toBe(false);
			hamburger.click();
			browser.sleep(500);  // give the opening animation some time
			expect(menu.isDisplayed()).toBe(true);
		});
		
		it('should close on internal navigation', function() {
			$('.hamburger .wrapper').click();
			browser.setLocation('view2');
			browser.sleep(500);  // give the closing animation some time
			expect($('.container-nav-search').isDisplayed()).toBe(false);
		});
	});
	
	describe('home', function() {
		beforeEach(function() {
			browser.get('index.html#/home');
		});
		
		it('should render the home page when the user navigates to /home', function() {
			expect($('.intro p').getText()).toMatch(/verzamelt herinneringen/);
		});
		
		it('should contain a button inviting people to join', function() {
			expect($('.intro a.button').getText()).toMatch(/Doe mee!/);
		});
		
		it('should list the blocks like in the mockup', function() {
			var blocks = $('.block-overview .container-content h3');
			expect(blocks.length).toBe(6);
			expect($(blocks[0]).getText()).toBe('Verhalen');
			expect($(blocks[1]).getText()).toBe('Artikelen');
			expect($(blocks[2]).getText()).toBe('Thema\'s');
			expect($(blocks[3]).getText()).toBe('Collecties');
			expect($(blocks[4]).getText()).toBe('Uitleg');
			expect($(blocks[5]).getText()).toBe('Voorwerpen');
		});
	});

});
