'use strict';

angular.module('catharijne.profiel.bewerken', [
	'catharijne.person',
]).config([
	'$routeProvider',
	function profileEditConfig($routeProvider) {
		$routeProvider.when('/profiel/bewerken', {
			templateUrl: 'views/profiel/bewerken.html',
			controller: 'ProfileEditCtrl',
		});
	},
]).controller('ProfileEditCtrl', [
	'$scope', 'user', 'extractPk', 'person', '$location',
	function profileEditController($scope, user, extractPk, person, $location) {
		function initDetails(personInstance) {
			$scope.portraitFileName = personInstance.portrait.match(/[^/]+$/)[0];
		}
		function initScope(userInstance) {
			$scope.my = person.get({pk: extractPk(userInstance.person)});
			$scope.my.$promise.then(initDetails);
		}
		function initFail() {
			$scope.loginFirst = true;
		}
		user.identity.$promise.then(initScope, initFail);
		$scope.genderOptions = {
			1: 'vrouw',
			2: 'man',
			3: 'anders',
		};
		function submitSuccess() {
			$location.url('/profiel');
		}
		function submitFail(xhr) {
			switch (xhr.status) {
			case 400:
				$scope.clientError = xhr.data;
				break;
			case 401:
			case 403:
				$scope.unauthorized = true;
				break;
			default:
				$scope.serverError = xhr.data;
			}
			$scope.pending = false;
		}
		$scope.saveProfile = function saveProfile() {
			$scope.pending = true;
			$scope.clientError = false;
			$scope.serverError = false;
			if ($scope.form.portrait.$isEmpty()) {
				$scope.my.$updateNoImage().then(submitSuccess, submitFail);
			} else {
				$scope.my.$update($scope.form).then(submitSuccess, submitFail);
			}
		};
	},
])