'use strict';

var routeFix = {
	captureRouteProvider: function() {
		angular.module('testRouteProviderAssist', [
			'ngRoute'
		]).config(function($routeProvider) {
			routeFix.$routeProvider = $routeProvider;
			spyOn(routeFix.$routeProvider, 'when');
		});
		module('testRouteProviderAssist');
	},
	checkRoute: function(route, template, controller) {
		it(
			'routes on ' + route + ' with ' + template + ' and ' + controller,
			function() {
				inject();
				expect(routeFix.$routeProvider.when).toHaveBeenCalledWith(
					route,
					{templateUrl: template, 'controller': controller}
				);
			}
		);
	}
};
