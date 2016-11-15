'use strict';

angular.module('catharijne.herinneringofprofiel', [
	'ngRoute',
	'catharijne.authRedirect',
	'catharijne.object',
]).config([
	'$routeProvider', 'authGuard',
	function($routeProvider, authGuard) {
		$routeProvider.when('/herinneringofprofiel', {
			templateUrl: 'views/herinneringofprofiel/herinneringofprofiel.html',
			resolve: {redirect: authGuard},
			controller: 'ActionChoiceCtrl',
		});
	},
]).controller('ActionChoiceCtrl', [
	'$scope', 'object',
	function actionChoiceController($scope, object) {
		function setBannerImage(objectList) {
			$scope.bannerImage = 'image/' + _.sample(objectList).image;
		}
		object.query().$promise.then(setBannerImage);
	},
]);
