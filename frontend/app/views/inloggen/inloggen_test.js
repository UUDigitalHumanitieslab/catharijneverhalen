'use strict';

describe('catharijne.inloggen', function() {
	beforeEach(function() {
		routeFix.captureRouteProvider();
		module('catharijne.inloggen');
	});
	
	routeFix.checkRoute(
		'/inloggen',
		'views/inloggen/inloggen.html'
	);
});
