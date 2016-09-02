'use strict';

describe('catharijne.block module', function() {
	var parentScope, element;
	var getChild = domFix.getChild;
	
	beforeEach(module('catharijne.block'));
	beforeEach(module('templates'));
	
	describe('parametric appBlock directive', function() {
		beforeEach(inject(function($compile, $rootScope) {
			parentScope = $rootScope;
			element = $compile(
				'<app-block item=testdata>'
			)(parentScope);
		}));
		
		it('renders a block with image, link, title and summary', function() {
			parentScope.testdata = {
				title: 'Banana',
				supertitle: 'Meeting',
				href: 'http://meeting.banana.com/',
				imageUrl: 'http://meeting.banana.com/image.jpg',
				description: 'Voice your opinion on bananas'
			};
			parentScope.$digest();
			var children = element.children();
			expect(children.length).toBe(2);
			expect(children[0].tagName).toMatch(/^a$/i);
			expect(children[1].tagName).toMatch(/^div$/i);
			var anchor = angular.element(children[0]);
			expect(anchor.prop('href')).toBe('http://meeting.banana.com/');
			var anchorChildren = anchor.children();
			expect(anchorChildren.length).toBe(1);
			expect(anchorChildren[0].tagName).toMatch(/^div$/i);
			var anchorDiv = angular.element(anchorChildren[0]);
			expect(anchorDiv.hasClass('container-image')).toBe(true);
			var anchorDivChildren = anchorDiv.children();
			expect(anchorDivChildren.length).toBe(2);
			expect(anchorDivChildren[0].tagName).toMatch(/^picture$/i);
			expect(anchorDivChildren[1].tagName).toMatch(/^span$/i);
			var anchorDivPicture = angular.element(anchorDivChildren[0]);
			expect(anchorDivPicture.children().length).toBe(1);
			var anchorDivPictureChild = anchorDivPicture.children()[0];
			expect(anchorDivPictureChild.tagName).toMatch(/^img$/i);
			expect(anchorDivPictureChild.srcset).toBe(
				'http://meeting.banana.com/image.jpg'
			);
			var anchorDivSpan = angular.element(anchorDivChildren[1]);
			expect(anchorDivSpan.hasClass('hover')).toBe(true);
			var anchorDivSpanChildren = anchorDivSpan.children();
			expect(anchorDivSpanChildren.length).toBe(1);
			expect(anchorDivSpanChildren[0].tagName).toMatch(/^div$/i);
			var anchorDivSpanDiv = angular.element(anchorDivSpanChildren[0]);
			expect(anchorDivSpanDiv.hasClass('wrapper')).toBe(true);
			expect(anchorDivSpanDiv.html().trim()).toMatch(/<span[^<>]*>Lees meer<\/span>/);
			var div = angular.element(children[1]);
			expect(div.hasClass('container-content')).toBe(true);
			var divChildren = div.children();
			expect(divChildren.length).toBe(4);
			expect(divChildren[0].tagName).toMatch(/^span$/i);
			expect(divChildren[1].tagName).toMatch(/^h3$/i);
			expect(divChildren[2].tagName).toMatch(/^p$/i);
			expect(divChildren[3].tagName).toMatch(/^a$/i);
			var divSpan = angular.element(divChildren[0]);
			expect(divSpan.hasClass('divider')).toBe(true);
			expect(divSpan.html().trim()).toBe('Meeting');
			var divHeader = angular.element(divChildren[1]);
			expect(divHeader.html().trim()).toBe('Banana');
			var divPar = angular.element(divChildren[2]);
			expect(divPar.html().trim()).toBe('Voice your opinion on bananas');
			var divAnchor = angular.element(divChildren[3]);
			expect(divAnchor.hasClass('button')).toBe(true);
			expect(divAnchor.prop('href')).toBe('http://meeting.banana.com/');
			expect(divAnchor.html().trim()).toBe('Lees meer');
		});
		
		it('permits overriding the link text', function() {
			parentScope.testdata = {
				title: 'Banana',
				supertitle: 'Meeting',
				href: 'http://meeting.banana.com/',
				imageUrl: 'http://meeting.banana.com/image.jpg',
				description: 'Voice your opinion on bananas',
				linkText: 'Fly'
			};
			parentScope.$digest();
			var children = element.children();
			var anchor = angular.element(children[0]);
			var anchorDiv = angular.element(anchor.children()[0]);
			var anchorDivSpan = angular.element(anchorDiv.children()[1]);
			var anchorDivSpanDiv = angular.element(anchorDivSpan.children()[0]);
			expect(anchorDivSpanDiv.html().trim()).toMatch(/<span[^<>]*>Fly<\/span>/);
			var div = angular.element(children[1]);
			var divAnchor = angular.element(div.children()[3]);
			expect(divAnchor.html().trim()).toBe('Fly');
		});
		
		it('permits setting click handlers on the anchor elements', function() {
			parentScope.testdata = {
				title: 'Banana',
				imageUrl: 'http://meeting.banana.com/image.jpg',
				description: 'Voice your opinion on bananas',
				click: function(){}
			};
			parentScope.$digest();
			var children = element.children();
			var anchor = angular.element(children[0]);
			var div = angular.element(children[1]);
			// no supertitle, so divAnchor is the 3rd instead of 4th child
			var divAnchor = angular.element(div.children()[2]);
			expect(getChild(div, 'a')[0]).toBe(divAnchor[0]);
			spyOn(parentScope.testdata, 'click');
			anchor.triggerHandler('click');
			expect(parentScope.testdata.click.calls.count()).toBe(1);
			divAnchor.triggerHandler('click');
			expect(parentScope.testdata.click.calls.count()).toBe(2);
			expect(parentScope.testdata.click.calls.first()).toEqual({
				object: parentScope.testdata,
				args: [jasmine.objectContaining({
					target: anchor[0],
					defaultPrevented: true
				})],
				returnValue: undefined
			});
			expect(parentScope.testdata.click.calls.mostRecent()).toEqual({
				object: parentScope.testdata,
				args: [jasmine.objectContaining({
					target: divAnchor[0],
					defaultPrevented: true
				})],
				returnValue: undefined
			});
		});
		
		it('can accept a href and a click handler at once', function() {
			parentScope.testdata = {
				title: 'Banana',
				imageUrl: 'http://meeting.banana.com/image.jpg',
				description: 'Voice your opinion on bananas',
				click: function(event){ event.preventDefault(); },
				href: 'http://test.com/'
			};
			parentScope.$digest();
			var children = element.children();
			var anchor = angular.element(children[0]);
			var div = angular.element(children[1]);
			// no supertitle, so divAnchor is the 3rd instead of 4th child
			var divAnchor = angular.element(div.children()[2]);
			expect(getChild(div, 'a')[0]).toBe(divAnchor[0]);
			expect(anchor.prop('href')).toBe('http://test.com/');
			expect(divAnchor.prop('href')).toBe('http://test.com/');
			spyOn(parentScope.testdata, 'click');
			anchor.triggerHandler('click');
			expect(parentScope.testdata.click.calls.count()).toBe(1);
			divAnchor.triggerHandler('click');
			expect(parentScope.testdata.click.calls.count()).toBe(2);
			var firstCall = parentScope.testdata.click.calls.first();
			expect(firstCall).toEqual({
				object: parentScope.testdata,
				args: [jasmine.objectContaining({
					target: anchor[0],
				})],
				returnValue: undefined
			});
			expect(firstCall.args[0]).not.toEqual(jasmine.objectContaining({
				defaultPrevented: true
			}));
			var lastCall = parentScope.testdata.click.calls.mostRecent();
			expect(lastCall).toEqual({
				object: parentScope.testdata,
				args: [jasmine.objectContaining({
					target: divAnchor[0],
				})],
				returnValue: undefined
			});
			expect(lastCall.args[0]).not.toEqual(jasmine.objectContaining({
				defaultPrevented: true
			}));
		});
	});
	
	describe('transcluding appBlock directive', function() {
		beforeEach(inject(function($compile, $rootScope) {
			parentScope = $rootScope;
			element = $compile(
				'<app-block>Test</app-block>'
			)(parentScope);
		}));
		
		it('wraps whatever content is passed to it', function() {
			parentScope.$digest();
			var html = element.html();
			expect(html).toContain('Test')
		});
	});
});
