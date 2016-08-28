'use strict';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 80000;

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

// used for contexts that load the google maps API
var globalInjectorFix = {
	queue: {},
	describe: function(description, context) {
		if (globalInjectorFix.timer) clearTimeout(globalInjectorFix.timer);
		globalInjectorFix.queue[description] = context;
		globalInjectorFix.timer = setTimeout(globalInjectorFix.submitQueue, 100);
	},
	submitQueue: function() {
		describe('pooled', function() {
			module.sharedInjector();
	
			beforeAll(function(done) {
				routeFix.captureRouteProvider();
				module('catharijne');
				module('templates');
				inject(function(uiGmapGoogleMapApi) {
					uiGmapGoogleMapApi.then(function(GMApi) {
						globalInjectorFix.GMApi = GMApi;
						done();
					});
				});
			});
	
			_.forEach(globalInjectorFix.queue, function(value, key) {
				describe(key, value);
			});
		});
		delete globalInjectorFix.describe;
	}
};
