'use strict';

angular.module('catharijne.menu', [])

.controller('MenuStatus', ['$scope', '$document', function($scope, $document) {
	$scope.menuOpen = false;
	
	$scope.openMenu = function() {
		$scope.menuOpen = true;
		$document.find('body').addClass('menu-open');
	};
	
	$scope.closeMenu = function() {
		$scope.menuOpen = false;
		$document.find('body').removeClass('menu-open');
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
