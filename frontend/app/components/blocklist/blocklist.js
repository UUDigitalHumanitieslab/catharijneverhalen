'use strict';

angular.module('catharijne.blocklist', [])

.directive('appBlocklist', function() {
	return {
		scope: {
			items: '='
		},
		templateUrl: 'components/blocklist/blocklist.html',
		replace: true
	};
});
