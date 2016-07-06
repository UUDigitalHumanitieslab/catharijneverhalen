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
				expect(element.html()).toBe('<div class="row ng-isolate-scope" items="testdata">\n\t<article class="block-overview">\n\t\t<!-- ngIf: items --><ul class="list-overview ng-scope" ng-if="items">\n\t\t\t<!-- ngRepeat: item in items -->\n\t\t</ul><!-- end ngIf: items -->\n\t\t<!-- ngIf: !items -->\n\t</article>\n</div>');
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
				expect(html).toContain('href="http://exposition.apple.com"');
				expect(html).toContain('>Learn how to peel oranges</p>');
			});
		});
		
		it('offers a transclusion mode', function() {
			inject(function($compile, $rootScope) {
				var element = $compile(
					'<app-blocklist>' +
					'\t<app-block>Grape</app-block>' +
					'\t<app-block>Blueberry</app-block>' +
					'</app-blocklist>'
				)($rootScope);
				$rootScope.$digest();
				var html = element.html();
				expect(html).toContain('</li>\t<li');
				expect(html).toContain('Grape');
				expect(html).toContain('Blueberry');
			});
		});
	});
});
