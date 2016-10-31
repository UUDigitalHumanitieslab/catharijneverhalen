'use strict';

angular.module('catharijne.voorwerpen', [
	'ngRoute',
	'catharijne.object',
]).config([
	'$routeProvider',
	function objectsConfig($routeProvider) {
		$routeProvider.when('/voorwerpen', {
			templateUrl: 'views/voorwerpen/voorwerpen.html',
			controller: 'ObjectsCtrl',
		});
	},
]).controller('ObjectsCtrl', [
	'object', '$scope',
	function objectsController(object, $scope) {
		function prepareItem(item) {
			item.linkText = 'Bekijk';
			item.href = '#/voorwerp/' + encodeURIComponent(item.url);
		}
		function initScope(objectList) {
			$scope.objects = objectList;
		}
		object.asDescriptions(prepareItem).then(initScope);
	},
]);
