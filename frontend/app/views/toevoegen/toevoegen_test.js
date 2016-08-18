'use strict';

describe('catharijne.toevoegen', function() {
	beforeEach(function() {
		module('catharijne.toevoegen');
	});
	
	describe('StoryFormCtrl', function() {
		var testScope, testController;
		
		beforeEach(inject(function($rootScope, $controller) {
			testScope = $rootScope.$new();
			testController = $controller('StoryFormCtrl', {$scope: testScope});
		}));
		
		it('keeps a story object on the scope', function() {
			expect(testScope.story).toBeDefined();
		});
	});
});
