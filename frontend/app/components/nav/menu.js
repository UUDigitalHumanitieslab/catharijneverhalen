'use strict';

angular.module('catharijne.menu', [
	'catharijne.user',
	'catharijne.banner',
]).factory('menu', [
	'$rootScope', '$document',
	function menuService($rootScope, $document) {
		var service = {};
		service.menuOpen = false;
		service.openMenu = function() {
			service.menuOpen = true;
			$document.find('body').addClass('menu-open');
		};
		service.closeMenu = function() {
			service.menuOpen = false;
			$document.find('body').removeClass('menu-open');
		};
		service.toggleMenu = function() {
			if (service.menuOpen) {
				service.closeMenu();
			} else {
				service.openMenu();
			}
		};
		$rootScope.$on('$routeChangeSuccess', function() {
			service.closeMenu();
		});
		return service;
	},
]).controller('MenuCtrl', [
	'$scope', 'menu', 'user', '$location',
	function menuController($scope, menu, user, $location) {
		$scope.menu = menu;
		$scope.user = user;
		$scope.location = $location;
	},
]).directive('appMenuButton', function menuButtonDirective() {
	return {
		scope: {},
		templateUrl: 'components/nav/menuButton.html',
		controller: 'MenuCtrl',
		// replace: true,
	};
}).directive('appMenuContent', function menuContentDirective() {
	return {
		scope: {},
		templateUrl: 'components/nav/menuContent.html',
		controller: 'MenuCtrl',
		// replace: true,
	};
});
