'use strict';

describe('catharijne.blocklist module', function() {
	beforeEach(module('catharijne.blocklist'));
	
	describe('appBlocklist directive', function() {
		beforeEach(module('templates'));
		
		it('always renders a block list wrapper', function() {
			inject(function($compile, $rootScope) {
				var element = $compile(
					'<div><app-blocklist items=testdata></div>'
				)($rootScope);
				$rootScope.testdata = [];
				$rootScope.$digest();
				expect(element.html()).toBe('<div class="row ng-isolate-scope" items="testdata">\n\t<article class="block-overview">\n\t\t<ul class="list-overview">\n\t\t\t<!-- ngRepeat: item in items -->\n\t\t</ul>\n\t</article>\n</div>');
			});
		});
		
		it('renders a block with image, link, title and summary', function() {
			inject(function($compile, $rootScope) {
				var element = $compile(
					'<app-blocklist items=testdata>'
				)($rootScope);
				$rootScope.testdata = [
					{
						title: 'Banana',
						supertitle: 'Meeting',
						href: 'http://meeting.banana.com',
						imageUrl: 'http://meeting.banana.com/image.jpg',
						description: 'Voice your opinion on bananas'
					}
				];
				$rootScope.$digest();
				var html = element.html();
				expect(html).toContain('<a href="http://meeting.banana.com">');
				expect(html).toContain('<img srcset="http://meeting.banana.com/image.jpg">');
				expect(html).toContain('<span>Lees meer</span>');
				expect(html).toContain('Meeting');
				expect(html).toContain('>Banana</h3>');
				expect(html).toContain('>Voice your opinion on bananas</p>');
				expect(html).toContain('<a href="http://meeting.banana.com" class="button">Lees meer</a>');
			});
		});
		
		it('can render multiple blocks in a list at once', function() {
			inject(function($compile, $rootScope) {
				var element = $compile(
					'<app-blocklist items=testdata>'
				)($rootScope);
				$rootScope.testdata = [
					{
						title: 'Apple',
						supertitle: 'Exposition',
						href: 'http://exposition.apple.com',
						imageUrl: 'http://exposition.apple.com/image.jpg',
						description: 'Watch the newest apples'
					}, {
						title: 'Orange',
						supertitle: 'Workshop',
						href: 'http://workshop.orange.com',
						imageUrl: 'http://workshop.orange.com/image.jpg',
						description: 'Learn how to peel oranges'
					}
				];
				$rootScope.$digest();
				var html = element.html();
				expect(html).toContain('<a href="http://exposition.apple.com">');
				expect(html).toContain('>Learn how to peel oranges</p>');
			});
		});
	});
});
