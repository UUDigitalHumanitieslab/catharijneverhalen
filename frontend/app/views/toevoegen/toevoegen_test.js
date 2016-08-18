'use strict';

describe('catharijne.toevoegen', function() {
	var $routeProvider;
	
	beforeEach(function() {
		angular.module('testAssist', [
			'ngRoute'
		]).config(function(_$routeProvider_) {
			$routeProvider = _$routeProvider_;
			spyOn($routeProvider, 'when');
		});
		module('testAssist');
		module('catharijne.toevoegen');
	});
	
	it('routes on /toevoegen with toevoegen.html and StoryFormCtrl', function() {
		inject();
		expect($routeProvider.when).toHaveBeenCalledWith('/toevoegen', {
			templateUrl: 'views/toevoegen/toevoegen.html',
			controller: 'StoryFormCtrl'
		});
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
