'use strict';

angular.module('catharijne.location', [
	'catharijne.googleMaps'
]).constant('locationDefaults', {  // The Netherlands
	coords: {latitude: 52.4, longitude: 4.5},
	zoom: 9
}).directive('appLocation', function() {return {
	templateUrl: 'components/location/location.html',
	controller: 'LocationCtrl',
	scope: {
		properties: '<'
	},
	replace: true
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
