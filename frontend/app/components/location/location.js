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
	uiGmapGoogleMapApi.then(function(maps) {
		
	})
}]);
