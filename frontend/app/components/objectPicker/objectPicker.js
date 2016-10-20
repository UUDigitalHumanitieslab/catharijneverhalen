'use strict';

angular.module(
	'catharijne.objectPicker',
	['catharijne.blocklist', 'catharijne.object'],
).directive('appObjectPicker', function() {
	return {
		scope: {
			objectUrl: '='
		},
		templateUrl: 'components/objectPicker/objectPicker.html',
		controller: 'ObjectPickerCtrl',
		replace: true
	};
}).controller('ObjectPickerCtrl', function($scope, $http, $log, object) {
	var self = this;
	$scope.picking = false;
	$scope.pick = function() {
		$scope.picking = true;
	};
	$scope.update = function(objectUrl) {
		object.get({url: objectUrl}, function updateSuccess(obj) {
			$scope.object = obj;
			$scope.objectUrl = objectUrl;
		}, function updateFail() {
			$scope.object = $scope.objectUrl = undefined;
		});
	};
	function transformObject(obj) {
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
				$scope.update(obj.url);
				$scope.picking = false;
			},
		};
	}
	object.query().$promise.then(function success(list) {
		$scope.objectDescriptions = _.map(list, transformObject);
	}, function fail(response) {
		$log.debug(response);
	});
	$scope.update();
});
