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
			title: 'Verhalen',
			href: '#/verhalen',
			description: 'Verhalen die zijn toegevoegd door onze deelnemers.'
		}, {
			title: 'Artikelen',
			href: '#/artikelen',
			description: 'Achtergrond bij objecten.'
		}, {
			title: 'Thema\'s',
			href: '#/themas',
			description: 'Objecten en verhalen, gegroepeerd rond gezamenlijke onderwerpen.'
		}, {
			title: 'Collecties',
			href: '#/collecties',
			description: 'Verzamelingen die zijn samengesteld door onze deelnemers.'
		}, {
			title: 'Uitleg',
			href: '#/uitleg',
			description: 'Hoe werk het project? Redactie. Contact.'
		}, {
			title: 'Objecten',
			href: '#/objecten',
			description: 'Een volledige catalogus van objecten.'
		}
	];
}]);