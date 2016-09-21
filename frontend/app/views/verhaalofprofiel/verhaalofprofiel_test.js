'use strict';

describe('catharijne.verhaalofprofiel', function() {
	beforeEach(function() {
		routeFix.captureRouteProvider();
		module('catharijne.verhaalofprofiel');
	});
	
	routeFix.checkRoute(
		'/verhaalofprofiel',
		'views/verhaalofprofiel/verhaalofprofiel.html'
	);
});
