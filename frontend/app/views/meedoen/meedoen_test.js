'use strict';

describe('catharijne.meedoen', function() {
	beforeEach(function() {
		routeFix.captureRouteProvider();
		module('catharijne.meedoen');
	});
	
	routeFix.checkRoute(
		'/meedoen',
		'views/meedoen/meedoen.html'
	);
});
