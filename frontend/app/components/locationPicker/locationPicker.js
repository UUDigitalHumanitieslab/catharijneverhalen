'use strict';

angular.module('catharijne.locationPicker', [
	'catharijne.location',
	'catharijne.googleMaps'
]).directive('appLocationPicker', function() {
	return {
		templateUrl: 'components/locationPicker/locationPicker.html',
		scope: {
			location: '='
		},
		controller: 'LocationPickerCtrl'
	};
}).controller('LocationPickerCtrl', [
	'locationDefaults',
	'$scope',
	'uiGmapGoogleMapApi',
	function(locationDefaults, $scope, uiGmapGoogleMapApi) {
		$scope.active = false;
		$scope.activate = function() {
			uiGmapGoogleMapApi.then(function() {
				$scope.active = true;
			});
		};
		if (! $scope.location) $scope.location = new Object(locationDefaults);
	}
]);
