'use strict';

injectorFix.describe('catharijne', function() {
	it('redirects / to /home', function() {
		inject();
		expect(routeFix.$routeProvider.otherwise).toHaveBeenCalledWith({
			redirectTo: '/home'
		});
	});
});
