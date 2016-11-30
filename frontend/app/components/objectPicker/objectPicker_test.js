'use strict';

describe('catharijne.objectPicker module', function() {
	var scope, backend, prefix, flushRequests, flushPromises;
	var responseMock = [{
		"image" : "ABM v275a-e.jpg",
		"inventoryID" : "ABM v275a-e",
		"title" : " Communieserviesje ",
		"creator" : "N.V. Société Céramique	",
		"dateRange" : "1950-1955"
	}, {
		"image" : "RMCC v1026.jpg",
		"inventoryID" : "RMCC v1026",
		"title" : " Eerste communiegeschenk: glas beschilderd met kelk en hostie, ",
		"creator" : "Maker onbekend	",
		"dateRange" : 1920
	}];
	
	beforeEach(function() {
		module('catharijne.objectPicker');
		module('catharijne.resource');
		module('templates');
		inject(function($rootScope, $httpBackend, currentOrigin) {
			scope = $rootScope.$new();
			prefix = currentOrigin + '/app/demo_objects.json';
			$httpBackend.whenGET('/api/gettoken/').respond(204, '', {
				'Set-Cookie': 'csrftoken=1234',
			});
			backend = $httpBackend.expectGET(prefix);
			flushRequests = _.bind($httpBackend.flush, $httpBackend);
			flushPromises = _.bind($rootScope.$apply, $rootScope);
		});
	});
	
	describe('ObjectPickerCtrl', function() {
		var controller;
		
		beforeEach(inject(function($controller) {
			controller = $controller('ObjectPickerCtrl', {$scope: scope});
		}));
		
		it('is not picking initially', function() {
			expect(scope.picking).toBe(false);
		});
		
		it('sets a scope method to start picking', function() {
			expect(scope.pick).toEqual(jasmine.any(Function));
			scope.pick();
			expect(scope.picking).toBe(true);
		});
		
		it('can update to a consistent state', function() {
			expect(scope.objectUrl).not.toBeDefined();
			expect(scope.object).not.toBeDefined();
			expect(scope.background).not.toBeDefined();
			scope.update();
			expect(scope.objectUrl).not.toBeDefined();
			expect(scope.object).not.toBeDefined();
			expect(scope.background).not.toBeDefined();
			scope.update(prefix + '#RMCC%20v1026');
			expect(scope.objectUrl).not.toBeDefined();
			expect(scope.object).not.toBeDefined();
			expect(scope.background).not.toBeDefined();
			backend.respond(_.cloneDeep(responseMock));
			flushRequests();
			scope.update();
			flushPromises();
			expect(scope.objectUrl).not.toBeDefined();
			expect(scope.object).not.toBeDefined();
			expect(scope.background['background-image']).not.toBeDefined();
			scope.update(prefix + '#RMCC%20v1026');
			flushPromises();
			expect(scope.objectUrl).toContain('#RMCC%20v1026');
			expect(scope.object).toEqual(responseMock[1]);
			expect(
				scope.background['background-image']
			).toContain(responseMock[1].image);
			scope.update();
			flushPromises();
			expect(scope.objectUrl).not.toBeDefined();
			expect(scope.object).not.toBeDefined();
			expect(scope.background['background-image']).not.toBeDefined();
			scope.update(prefix + '#ABM%20v275a-e');
			flushPromises();
			expect(scope.objectUrl).toContain('#ABM%20v275a-e');
			expect(scope.object).toEqual(responseMock[0]);
			expect(
				scope.background['background-image']
			).toContain(responseMock[1].image);
			scope.update(prefix + '#RMCC%20v1026');
			flushPromises();
			expect(scope.objectUrl).toContain('#RMCC%20v1026');
			expect(scope.object).toEqual(responseMock[1]);
			expect(
				scope.background['background-image']
			).toContain(responseMock[1].image);
		});
		
		it('fetches data asynchronously', function() {
			spyOn(scope, 'update').and.callThrough();
			backend.respond(_.cloneDeep(responseMock));
			flushRequests();
			expect(scope.update).toHaveBeenCalledWith(/*nothing*/);
			expect(controller.allObjects).toEqual(responseMock);
			expect(scope.objectDescriptions).toEqual([{
				"imageUrl" : "image/ABM v275a-e.jpg",
				"title" : " Communieserviesje ",
				"description" : "N.V. Société Céramique, 1950-1955",
				"linkText": "Kies",
				"click": jasmine.any(Function),
			}, {
				"imageUrl" : "image/RMCC v1026.jpg",
				"title" : " Eerste communiegeschenk: glas beschilderd met kelk en hostie, ",
				"description" : "Maker onbekend, 1920",
				"linkText": "Kies",
				"click": jasmine.any(Function),
			}]);
		});
		
		it('sets click handlers for making a choice', function() {
			spyOn(scope, 'update');
			backend.respond(_.cloneDeep(responseMock));
			flushRequests();
			scope.objectDescriptions[0].click();
			expect(scope.update.calls.mostRecent().args).toEqual([
				'ABM v275a-e',
			]);
			scope.objectDescriptions[1].click();
			expect(scope.update.calls.mostRecent().args).toEqual([
				'RMCC v1026',
			]);
		});
		
		it('logs fetch errors', inject(function($log) {
			backend.respond(404, 'not found');
			flushRequests();
			expect($log.debug.logs.length).toBe(1);
			expect($log.debug.logs[0].length).toBe(1);
			expect($log.debug.logs[0][0]).toEqual(jasmine.objectContaining({
				status: 404,
				data: 'not found'
			}));
		}));
	});
	
	describe('appObjectPicker directive', function() {
		var parentScope, elementFunc, element;
		var getChild = function(query) {
			return domFix.getChild(element, query);
		};
		var createElement = function() {
			element = elementFunc(parentScope);
			parentScope.$digest();
		};
		var setScope = function() {
			// For consistency, `scope` belongs to the controller.
			element.prepend('<span>');
			var child = getChild();  // the span from above
			scope = child.scope();
			child.remove();
		};
		
		beforeEach(inject(function($compile) {
			parentScope = scope;
			elementFunc = $compile(
				'<app-object-picker object-id=id></app-object-picker>'
			);
			backend.respond(_.cloneDeep(responseMock));
		}));
		
		it('creates a figure element', function() {
			createElement();
			expect(element.hasClass('app-object-picker')).toBe(true);
		});
		
		it('shows image with caption when available', function() {
			parentScope.id = 'RMCC v1026';
			createElement();
			flushRequests();
			expect(element.children().length).toBe(3);
			setScope();
			var img = getChild('img');
			expect(img.length).toBe(1);
			expect(img.attr('src')).toBe('image/RMCC v1026.jpg');
			var caption = getChild('figcaption');
			expect(caption.length).toBe(1);
			expect(caption.text()).toBe(scope.objectDescriptions[1].title);
		});
		
		it('shows a button otherwise', function() {
			createElement();
			expect(element.children().length).toBe(2);
			setScope();
			expect(scope.$parent).toBe(parentScope);
			var button = getChild('button');
			expect(button.length).toBe(1);
			expect(scope.picking).toBe(false);
			button.triggerHandler('click');
			expect(scope.picking).toBe(true);
		});
		
		it('displays the options when picking', function() {
			createElement();
			flushRequests();
			setScope();
			scope.picking = true;
			scope.$digest();
			var ul = getChild('ul');
			expect(ul.length).toBe(1);
			expect(ul.children().length).toBe(2);  // one for each object
		});
	});
});
