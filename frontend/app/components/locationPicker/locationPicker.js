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
	'uiGmapGoogleMapApi',
	'uiGmapIsReady',
	function(locationDefaults, $scope, uiGmapGoogleMapApi, uiGmapIsReady) {
		$scope.handle = {};
		$scope.active = false;
		$scope.activate = function() {
			$scope.active = true;
			$scope.kickedOff = true;
		};
		$scope.deactivate = function(event) {
			$scope.debugEvent(event);
			$scope.active = false;
		};
		$scope.zoom = $scope.location.zoom || locationDefaults.zoom;
		$scope.center = _.assign(
			{},
			$scope.location.coords || locationDefaults.coords
		);
		var expectedMapInstances = 1;
		if ($scope.has_picked) expectedMapInstances++;
		// uiGmapGoogleMapApi.then(function(api) {
		// 	uiGmapIsReady.promise(expectedMapInstances).then(function(maps) {
		// 		var map = $scope.handle.getGMap();
		// 		api.event.addDomListener(map, 'click', function(event) {
		// 			event.stop();
		// 		});
		// 	});
		// });
		$scope.debugEvent = function(event) {
			console.debug(event.constructor.toString(), 'on', event.target);
		};
		$scope.mapEvents = {
			click: function(map, eventName, args) {
				// args[0].stop();
				var newCoords = args[0].latLng;
				$scope.location.coords = {
					latitude: newCoords.lat(),
					longitude: newCoords.lng()
				};
				console.debug($scope.location.coords);
				$scope.location.zoom = map.getZoom();
				if (! $scope.location.id) $scope.location.id = 'temp';
				// $scope.$digest();
			}
		};
		this.$doCheck = function() {
			console.debug({
				active: $scope.active,
				center: $scope.center,
				hasPicked: $scope.location.id
			});
		};
	}
]);
