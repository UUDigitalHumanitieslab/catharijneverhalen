'use strict';

angular.module('catharijne.locationPicker', [
	'catharijne.location'
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
	function(locationDefaults, $scope) {
		$scope.active = false;
		$scope.activate = function() {
			$scope.active = true;
		};
		if (! $scope.location) $scope.location = new Object(locationDefaults);
	}
]);
