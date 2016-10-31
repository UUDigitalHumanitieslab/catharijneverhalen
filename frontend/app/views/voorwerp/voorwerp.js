'use strict';

angular.module('catharijne.voorwerp', [
	'ngRoute',
	'catharijne.object',
]).config([
	'$routeProvider',
	function objectViewConfig($routeProvider) {
		$routeProvider.when('/voorwerp', {
			templateUrl: 'views/voorwerp/voorwerp.html',
			controller: 'ObjectViewCtrl',
		});
	},
]).controller('ObjectViewCtrl', [
	'object', '$routeParams', '$scope',
	function objectViewController(object, $routeParams, $scope) {
		$scope.objectUrl = encodeURIComponent($routeParams.url);
		$scope.object = object.get({url: $routeParams.url});
	},
]);
