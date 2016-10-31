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
			$scope.background = {
				'background-image': 'url("image/' + obj.image + '")',
			};
		}, function updateFail() {
			$scope.object = $scope.objectUrl = undefined;
			$scope.background = {};
		});
	};
	object.asDescriptions(function handleClick(description) {
		description.linkText = 'Kies';
		description.click = function() {
			$scope.update(description.url);
			$scope.picking = false;
		};
	}).then(function success(list) {
		$scope.objectDescriptions = list;
	}, function fail(response) {
		$log.debug(response);
	});
	$scope.update();
});
