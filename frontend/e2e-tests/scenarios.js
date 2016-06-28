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
			var button = $('.intro a.button');
			expect(button.getText()).toMatch(/Doe mee!/);
			button.click();
			expect(browser.getLocationAbsUrl()).toContain('/meedoen');
		});
		
		it('should list the blocks like in the mockup', function() {
			var blocks = element.all(by.css(
				'.block-overview .container-content h3'
			));
			expect(blocks.count()).toBe(6);
			expect(blocks.get(0).getText()).toBe('Verhalen');
			expect(blocks.get(1).getText()).toBe('Artikelen');
			expect(blocks.get(2).getText()).toBe('Thema\'s');
			expect(blocks.get(3).getText()).toBe('Collecties');
			expect(blocks.get(4).getText()).toBe('Uitleg');
			expect(blocks.get(5).getText()).toBe('Objecten');
		});
	});
	
	describe('meedoen', function() {
		beforeEach(function() {
			browser.get('index.html#/meedoen');
		});
		
		it('should render the participation page when the user navigates to /meedoen', function() {
			var buttons = element.all(by.css('.block-cta a h3'));
			expect(buttons.count()).toBe(2);
			expect(buttons.get(0).getText()).toBe('Ik ben hier voor het eerst');
			expect(buttons.get(1).getText()).toBe('Ik doe al mee');
		});
	});

	describe('aanmelden', function() {
		beforeEach(function() {
			browser.get('index.html#/aanmelden');
		});
		
		it('should render the registration page when the user navigates to /aanmelden', function() {
			var title = $('.block-cta form h3');
			expect(title.getText()).toContain('Maak een account');
		});
	});

	describe('inloggen', function() {
		beforeEach(function() {
			browser.get('index.html#/inloggen');
		});
		
		it('should render the registration page when the user navigates to /inloggen', function() {
			var title = $('.block-cta h3');
			expect(title.getText()).toContain('Welkom terug');
		});
	});

});
