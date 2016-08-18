'use strict';

angular.module('catharijne.location', [
	'catharijne.googleMaps'
]).component('appLocation', {
	templateUrl: 'components/location/location.html',
	replace: true,
	controller: 'LocationCtrl',
	bindings: {
		id: '<',
		coords: '<',
		bounds: '<',
		label: '<'
	}
}).controller('LocationCtrl', ['$scope', 'uiGmapGoogleMapApi', function($scope, uiGmapGoogleMapApi) {
	uiGmapGoogleMapApi.then(function(maps) {
		
	})
}])