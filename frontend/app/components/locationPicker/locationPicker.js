'use strict';

angular.module('catharijne.locationPicker', [
	'catharijne.location',
	'catharijne.googleMaps'
]).directive('appLocationPicker', ['locationDefaults', function(locationDefaults) {
	return {
		require: 'ngModel',
		templateUrl: 'components/locationPicker/locationPicker.html',
		scope: {},
		controller: 'LocationPickerCtrl',
		link: function(scope, element, attributes, ngModelController) {
			var controller = element.controller('LocationPickerCtrl');
			
			element.on('blur', function() {
				ngModelController.$setViewValue(scope.getValue());
			});
			
			ngModelController.$render = function() {
				scope.location = ngModelController.$viewValue;
			};
			
			scope.location = ngModelController.$viewValue || new Object(locationDefaults);
		}
	};
}]).controller('LocationPickerCtrl', [
	'$scope',
	'uiGmapGoogleMapApi',
	function($scope, uiGmapGoogleMapApi) {
		$scope.active = false;
		$scope.activate = function() {
			uiGmapGoogleMapApi.then(function() {
				$scope.active = true;
			});
		};
	}
]);
