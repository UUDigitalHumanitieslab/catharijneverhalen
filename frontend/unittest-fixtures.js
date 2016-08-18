'use strict';

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
