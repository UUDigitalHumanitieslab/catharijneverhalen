'use strict';

angular.module('catharijne.home', ['ngRoute', 'catharijne.blocklist'])

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
	
	// The blocks that appear on the homepage
	// TODO: images
	$scope.blocks = [
		{
			title: 'Herinneringen',
			href: '#/herinneringen',
			description: 'Lees, beluister en bekijk alle persoonlijke herinneringen.'
		}, {
			title: 'Voorwerpen',
			href: '#/voorwerpen',
			description: 'Bekijk de collectie voorwerpen van het museum.'
		}, {
			title: 'Uitleg en contact',
			href: '#/uitleg',
			description: 'Klik hier voor meer informatie en contact.',
			linkText: 'Naar uitleg en contact',
		}
	];
}]);