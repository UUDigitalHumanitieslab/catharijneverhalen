'use strict';

angular.module('catharijne.blocklist', ['catharijne.block'])

.directive('appBlocklist', function() {
	return {
		scope: {
			items: '<'
		},
		templateUrl: 'components/blocklist/blocklist.html',
		replace: true,
		transclude: true
	};
});
