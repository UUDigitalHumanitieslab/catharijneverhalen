'use strict';

angular.module('catharijne.location', [
	'catharijne.googleMaps'
]).directive('appLocation', function() {return {
	templateUrl: 'components/location/location.html',
	controller: 'LocationCtrl',
	scope: {
		properties: '<'
	}
};}).controller('LocationCtrl', ['$scope', 'uiGmapGoogleMapApi', function($scope, uiGmapGoogleMapApi) {
	$scope.mapOptions = {
		draggable: false,
		scrollwheel: false
	};
	$scope.markerOptions = {
		clickable: false
	};
	uiGmapGoogleMapApi.then(function(maps) {
		
	});
}]);
