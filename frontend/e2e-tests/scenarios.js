'use strict';

/* https://github.com/angular/protractor/blob/master/docs/toc.md */

describe('catharijne app', function() {

	it('should automatically redirect to /home when location hash/fragment is empty', function() {
		browser.get('index.html');
		expect(browser.getLocationAbsUrl()).toMatch("/home");
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
		
		it('should render the authentication page when the user navigates to /inloggen', function() {
			var title = $('.block-cta h3');
			expect(title.getText()).toContain('Welkom terug');
		});
	});
	
	describe('verhaalofprofiel', function() {
		beforeEach(function() {
			browser.get('index.html#/verhaalofprofiel');
		});
		
		it('should give a choice between writing a story or amending the profile when the user navigates to /verhaalofprofiel', function() {
			var buttons = element.all(by.css('.block-cta a h3'));
			expect(buttons.count()).toBe(2);
			expect(buttons.get(0).getText()).toBe('Schrijf een verhaal');
			expect(buttons.get(1).getText()).toBe('Naar je profiel');
		});
	});
	
	describe('profiel', function() {
		beforeEach(function() {
			browser.get('index.html#/profiel');
		});
		
		it('displays user data, a stories preview and a collections preview', function() {
			var blocks = element.all(by.css('ul.list-overview li'));
			expect(blocks.count()).toBe(3);
			expect(blocks.get(0).getText()).toContain('Woonplaats');
			expect(blocks.get(1).getText()).toContain('Verhalen');
			expect(blocks.get(2).getText()).toContain('Collecties');
		});
	});
	
	describe('toevoegen', function() {
		beforeEach(function() {
			browser.get('index.html#/toevoegen');
		});
		
		it('enables the user to contribute a memory', function() {
			var formFields = element.all(by.css('fieldset > :not(fieldset)'));
			expect(formFields.count()).toBe(9);
			expect(formFields.get(0).getText()).toContain('Kies een voorwerp');
			expect(formFields.get(1).getText()).toContain('Schrijftips');
			expect(formFields.get(2).getText()).toContain('Titel');
			expect(formFields.get(3).getText()).toContain('Locatie');
			expect(formFields.get(4).getText()).toContain('Jaar');
			expect(formFields.get(5).getText()).toContain('Inleiding');
			expect(formFields.get(6).getText()).toContain('Mijn herinnering');
			expect(formFields.get(7).getAttribute('value')).toBe('Voeg media toe');
			expect(formFields.get(8).getText()).toContain('Ik heb mijn verhaal verteld');
		});
	});

});
