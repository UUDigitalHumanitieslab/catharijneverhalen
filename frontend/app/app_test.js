'use strict';

describe('catharijne', function() {
	beforeEach(function() {
		routeFix.captureRouteProvider();
		module('catharijne');
	});
	
	it('redirects / to /home', function() {
		inject();
		expect(routeFix.$routeProvider.otherwise).toHaveBeenCalledWith({
			redirectTo: '/home'
		});
	});
});
