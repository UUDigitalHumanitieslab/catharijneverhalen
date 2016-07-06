'use strict';

describe('catharijne.block module', function() {
	beforeEach(module('catharijne.block'));
	
	describe('parametric appBlock directive', function() {
		beforeEach(module('templates'));
		
		it('renders a block with image, link, title and summary', function() {
			inject(function($compile, $rootScope) {
				var element = $compile(
					'<app-block item=testdata>'
				)($rootScope);
				$rootScope.testdata = {
					title: 'Banana',
					supertitle: 'Meeting',
					href: 'http://meeting.banana.com',
					imageUrl: 'http://meeting.banana.com/image.jpg',
					description: 'Voice your opinion on bananas'
				};
				$rootScope.$digest();
				var html = element.html();
				expect(html).toContain('<a ng-if="item.imageUrl" href="http://meeting.banana.com" class="ng-scope">');
				expect(html).toContain('<img srcset="http://meeting.banana.com/image.jpg">');
				expect(html).toContain('<span>Lees meer</span>');
				expect(html).toContain('Meeting');
				expect(html).toContain('>Banana</h3>');
				expect(html).toContain('>Voice your opinion on bananas</p>');
				expect(html).toContain('<a href="http://meeting.banana.com" class="button">Lees meer</a>');
			});
		});
	});
	
	describe('transcluding appBlock directive', function() {
		beforeEach(module('templates'));
		
		it('wraps whatever content is passed to it', function() {
			inject(function($compile, $rootScope) {
				var element = $compile(
					'<app-block>Test</app-block>'
				)($rootScope);
				$rootScope.$digest();
				var html = element.html();
				expect(html).toContain('Test')
			});
		});
	});
});
