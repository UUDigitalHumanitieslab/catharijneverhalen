'use strict';

angular.module(
	'catharijne.objectPicker',
	['catharijne.blocklist']
).directive('app-object-picker', function() {
	return {
		scope: {
			objectID: '='
		},
		templateUrl: 'components/objectPicker/objectPicker.html',
		controller: 'ObjectPickerCtrl',
		replace: true
	};
}).controller('ObjectPickerCtrl', function($scope, $http, $log) {
	var self = this;
	$scope.picking = false;
	$scope.update = function(objectID) {
		if (objectID) $scope.objectID = objectID;
		if ($scope.objectID) $scope.object = _.find(self.allObjects, {inventoryID: objectID});
		if (! $scope.object) $scope.objectID = undefined;
	};
	$http.get('demo_objects.json', {
		responseType: 'json'
	}).then(function success(response) {
		self.allObjects = response.data;
		$scope.objectDescriptions = _.map(self.allObjects, function(obj) {
			return {
				imageUrl: 'image/' + obj.image,
				title: obj.title,
				description: obj.creator + ' (' + obj.dateRange + ')'
			};
		});
		$scope.update();
	}, function fail(response) {
		$log.debug(response);
	});
});
