'use strict';

// Common logic for testing route configuration
var routeFix = {
	captureRouteProvider: function() {
		angular.module('testRouteProviderAssist', [
			'ngRoute'
		]).config(function($routeProvider) {
			routeFix.$routeProvider = $routeProvider;
			spyOn(routeFix.$routeProvider, 'when');
			spyOn(routeFix.$routeProvider, 'otherwise');
		});
		module('testRouteProviderAssist');
	},
	checkRoute: function(route, template, controller) {
		var specString = 'routes on ' + route + ' with ' + template;
		var routeConfig = {templateUrl: template};
		if (controller) {
			specString += ' and ' + controller;
			routeConfig.controller = controller;
		}
		it(specString, function() {
			inject();
			expect(routeFix.$routeProvider.when).toHaveBeenCalledWith(route, routeConfig);
		});
	}
};

/*
	Custom test registration for specs that load Google Maps.
	This speeds up testing and prevents the error message about multiple
	instances of the Google Maps API.
	Use by calling injectorFix.describe instead of the global describe.

	DO NOT create or load modules in your spec. The specs are inserted
	in a context with a "fat" injector already containing everything you
	might possibly need, including routeFix and the templates.
*/
var injectorFix = {
	queue: {},
	describe: function(description, context) {
		injectorFix.queue[description] = context;
	}
};

// Helper functions for DOM manipulation
var domFix = {
	getChild: function(element, query) {
		element = angular.element(element);
		var rawChild;
		if (query) {
			rawChild = element[0].querySelector(query);
		} else {
			rawChild = element.children()[0];
		}
		return angular.element(rawChild);
	}
};
