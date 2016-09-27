'use strict';

angular.module(
	'catharijne.objectPicker',
	['catharijne.blocklist']
).directive('appObjectPicker', function() {
	return {
		scope: {
			objectId: '='
		},
		templateUrl: 'components/objectPicker/objectPicker.html',
		controller: 'ObjectPickerCtrl',
		replace: true
	};
}).controller('ObjectPickerCtrl', function($scope, $http, $log) {
	var self = this;
	$scope.picking = false;
	$scope.pick = function() {
		$scope.picking = true;
	};
	$scope.update = function(objectId) {
		if (objectId) $scope.objectId = objectId;
		$scope.object = _.find(self.allObjects, {inventoryID: $scope.objectId});
		if (! $scope.object) $scope.objectId = undefined;
	};
	$http.get('demo_objects.json', {
		responseType: 'json'
	}).then(function success(response) {
		self.allObjects = response.data;
		$scope.objectDescriptions = _.map(self.allObjects, function(obj) {
			var dateRange = obj.dateRange, creator = obj.creator;
			if (typeof dateRange === 'string') {
				dateRange = dateRange.trim();
			}
			if (typeof creator === 'string') {
				creator = creator.trim();
			}
			creator = creator || 'Maker onbekend';
			dateRange = dateRange || 'datum onbekend';
			return {
				imageUrl: 'image/' + obj.image,
				title: obj.title,
				description: creator + ', ' + dateRange,
				linkText: 'Kies',
				click: function() {
					$scope.update(obj.inventoryID);
					$scope.picking = false;
				},
			};
		});
		$scope.update();
	}, function fail(response) {
		$log.debug(response);
	});
});
