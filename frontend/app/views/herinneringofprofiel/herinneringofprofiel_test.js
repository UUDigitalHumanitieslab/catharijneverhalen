'use strict';

describe('catharijne.herinneringofprofiel', function() {
	beforeEach(function() {
		routeFix.captureRouteProvider();
		module('catharijne.herinneringofprofiel');
	});
	
	routeFix.checkRoute(
		'/herinneringofprofiel',
		'views/herinneringofprofiel/herinneringofprofiel.html',
		'RandomObjectImageCtrl'
	);
});
