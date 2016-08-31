'use strict';

angular.module('catharijne.locationPicker', [
	'catharijne.location'
]).directive('appLocationPicker', function() {
	return {
		templateUrl: 'components/locationPicker/locationPicker.html',
		scope: {
			location: '=*'
		},
		controller: 'LocationPickerCtrl'
	};
}).controller('LocationPickerCtrl', [
	'locationDefaults',
	'$scope',
	'uiGmapIsReady',
	function(locationDefaults, $scope, uiGmapIsReady) {
		$scope.handle = {};
		$scope.active = false;
		$scope.activate = function() {
			$scope.active = true;
		};
		$scope.deactivate = function($event) {
			if ($event) {
				var target = angular.element($event.target);
				console.debug(target);
				if (! target.hasClass('close-button')) return;
			}
			$scope.active = false;
		};
		$scope.center = _.assign(
			{},
			$scope.location.coords || locationDefaults.coords
		);
		$scope.zoom = $scope.location.zoom || locationDefaults.zoom;
		$scope.has_picked = ($scope.location.id != undefined);
		$scope.mapEvents = {
			click: function(map, eventName, args) {
				console.log(eventName);
				args[0].stop();
				var newCoords = args[0].latLng;
				$scope.location.coords = {
					latitude: newCoords.lat(),
					longitude: newCoords.lng()
				};
				$scope.location.zoom = $scope.zoom;
				if (! $scope.location.id) $scope.location.id = 'temp';
				$scope.has_picked = true;
				// $scope.handle.refresh();
			}// ,
// 			center_changed: function(map, eventName) {
// 				var newCenter = map.getCenter();
// 				$scope.center = {
// 					latitude: newCenter.lat(),
// 					longitude: newCenter.lng()
// 				};
// 			},
// 			zoom_changed: function(map, eventName) {
// 				$scope.zoom = map.getZoom();
// 			}
		};
		// $scope.markerEvents = {
		// 	click: function(marker, eventName, model, args) {
		// 		$scope.has_picked = false;
		// 		$scope.$digest();
		// 		delete $scope.location.coords;
		// 		delete $scope.location.zoom;
		// 	}
		// };
		// uiGmapIsReady.promise(1).then(function() {
		// 	$scope.handle.refresh();
		// });
	}
]);
