'use strict';

describe('pooled', function() {
	module.sharedInjector();
	
	// Just create one big injector, containing everything you may ever need.
	beforeAll(function() {
		routeFix.captureRouteProvider();
		module('catharijne');
		module('templates');
		inject();
	});
	
	_.forEach(injectorFix.queue, function(context, description) {
		describe(description, context);
	});
});
