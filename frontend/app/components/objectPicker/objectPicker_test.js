'use strict';

describe('catharijne.objectPicker module', function() {
	var scope, backend, flushRequests;
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
		inject(function($rootScope, $httpBackend) {
			scope = $rootScope.$new();
			backend = $httpBackend.expectGET('demo_objects.json');
			flushRequests = _.bind($httpBackend.flush, $httpBackend);
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
		
		it('can update to a consistent state', function() {
			expect(scope.objectID).not.toBeDefined();
			expect(scope.object).not.toBeDefined();
			expect(controller.allObjects).not.toBeDefined();
			scope.update();
			expect(scope.objectID).not.toBeDefined();
			expect(scope.object).not.toBeDefined();
			expect(controller.allObjects).not.toBeDefined();
			scope.objectID = 'RMCC v1026';
			scope.update();
			expect(scope.objectID).not.toBeDefined();
			expect(scope.object).not.toBeDefined();
			expect(controller.allObjects).not.toBeDefined();
			controller.allObjects = _.cloneDeep(responseMock);
			scope.update();
			expect(scope.objectID).not.toBeDefined();
			expect(scope.object).not.toBeDefined();
			expect(controller.allObjects).toEqual(responseMock);
			scope.objectID = 'RMCC v1026';
			scope.update();
			expect(scope.objectID).toBe('RMCC v1026');
			expect(scope.object).toEqual(responseMock[1]);
			expect(controller.allObjects).toEqual(responseMock);
			scope.update();
			expect(scope.objectID).toBe('RMCC v1026');
			expect(scope.object).toEqual(responseMock[1]);
			expect(controller.allObjects).toEqual(responseMock);
			delete scope.object;
			scope.update();
			expect(scope.objectID).toBe('RMCC v1026');
			expect(scope.object).toEqual(responseMock[1]);
			expect(controller.allObjects).toEqual(responseMock);
			scope.update('ABM v275a-e');
			expect(scope.objectID).toBe('ABM v275a-e');
			expect(scope.object).toEqual(responseMock[0]);
			expect(controller.allObjects).toEqual(responseMock);
			delete scope.objectID;
			scope.update();
			expect(scope.objectID).not.toBeDefined();
			expect(scope.object).not.toBeDefined();
			expect(controller.allObjects).toEqual(responseMock);
			scope.update('RMCC v1026');
			expect(scope.objectID).toBe('RMCC v1026');
			expect(scope.object).toEqual(responseMock[1]);
			expect(controller.allObjects).toEqual(responseMock);
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
				"description" : "N.V. Société Céramique	 (1950-1955)"
			}, {
				"imageUrl" : "image/RMCC v1026.jpg",
				"title" : " Eerste communiegeschenk: glas beschilderd met kelk en hostie, ",
				"description" : "Maker onbekend	 (1920)"
			}]);
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
});
