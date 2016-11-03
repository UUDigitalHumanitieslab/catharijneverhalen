'use strict';

/*
	This directive is grouped with the other nav components because
	not having a banner results in the menu being on top of the content.
*/
angular.module('catharijne.banner', [
]).directive('ccBanner', function ccBannerDirective() {
	return {
		templateUrl: 'components/nav/banner.html',
		scope: {
			image: '<',
			large: '<',
			tiny: '<',
		},
		// replace: true,
	};
});
