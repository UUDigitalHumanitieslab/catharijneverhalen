'use strict';

describe('catharijne.aanmelden', function() {
	beforeEach(function() {
		routeFix.captureRouteProvider();
		module('catharijne.aanmelden');
	});
	
	routeFix.checkRoute(
		'/aanmelden',
		'views/aanmelden/aanmelden.html'
	);
});
