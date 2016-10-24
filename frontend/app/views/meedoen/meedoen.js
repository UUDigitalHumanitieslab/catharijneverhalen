'use strict';

angular.module('catharijne.meedoen', ['ngRoute', 'catharijne.user'])

.config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/meedoen', {
		templateUrl: 'views/meedoen/meedoen.html',
		controller: 'ParticipateCtrl',
	});
}]).controller('ParticipateCtrl', [
	'$scope', '$routeParams', 'user', '$location',
	function participateController($scope, $routeParams, user, $location) {
		user.whenAuthenticated(function forward() {
			$location.replace();
			if ($routeParams.next) {
				$location.url($routeParams.next);
			} else {
				$location.url('/herinneringofprofiel');
			}
		});
		$scope.next = $routeParams.next;
	},
]);
