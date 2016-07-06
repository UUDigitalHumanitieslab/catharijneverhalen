'use strict';

angular.module('catharijne.block', [])

.directive('appBlock', function() {
	return {
		scope: {
			item: '='
		},
		templateUrl: function (tElement, tAttrs) {
			if (tAttrs.item) {
				return 'components/blocklist/block-parametric.html';
			} else return 'components/blocklist/block-transcluding.html';
		},
		replace: true,
		transclude: true
	};
});
