'use strict';

angular.module('catharijne.home', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/home', {
		templateUrl: 'views/home/home.html',
		controller: 'HomeCtrl'
	});
}])

.controller('HomeCtrl', ['$scope', '$document', function($scope, $document) {
	// code below ensures that the intro block has a dark background
	// when the home view is selected
	$scope.body = $document.find('body');
	$scope.body.addClass('home');
	$scope.$on('$routeChangeStart', function() {
		$scope.body.removeClass('home');
	});
}]);