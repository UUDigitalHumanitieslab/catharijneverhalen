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
			return {
				imageUrl: 'image/' + obj.image,
				title: obj.title,
				description: obj.creator + ' (' + obj.dateRange + ')',
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
