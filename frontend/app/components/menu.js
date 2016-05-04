'use strict';

angular.module('catharijne.menu', [])

.controller('MenuStatus', ['$scope', function($scope) {
	$scope.menuOpen = false;
	$scope.menuDisplayClass = '';
	
	$scope.openMenu = function() {
		$scope.menuOpen = true;
		$scope.menuDisplayClass = 'menu-open';
	};
	
	$scope.closeMenu = function() {
		$scope.menuOpen = false;
		$scope.menuDisplayClass = '';
	};
	
	$scope.toggleMenu = function() {
		if ($scope.menuOpen) {
			$scope.closeMenu();
		} else {
			$scope.openMenu();
		}
	};
	
	$scope.$on('$routeChangeSuccess', function() {
		$scope.closeMenu();
	});
}]);
