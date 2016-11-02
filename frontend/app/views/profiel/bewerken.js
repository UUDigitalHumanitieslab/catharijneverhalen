'use strict';

angular.module('catharijne.profiel.bewerken', [
	'catharijne.person',
	'catharijne.authRedirect',
]).config([
	'$routeProvider', 'authGuard',
	function profileEditConfig($routeProvider, authGuard) {
		$routeProvider.when('/profiel/bewerken', {
			templateUrl: 'views/profiel/bewerken.html',
			controller: 'ProfileEditCtrl',
			resolve: {redirect: authGuard},
		});
	},
]).controller('ProfileEditCtrl', [
	'$scope', 'user', 'extractPk', 'person', '$location',
	'parentList', 'educationLevelList', 'maritalStatusList',
	function profileEditController(
		$scope, user, extractPk, person, $location,
		educationLevelList, maritalStatusList
	) {
		function initDetails(personInstance) {
			$scope.portraitFileName = personInstance.portrait.match(/[^/]+$/)[0];
		}
		function initScope(userInstance) {
			$scope.my = person.get({pk: extractPk(userInstance.person)});
			$scope.my.$promise.then(initDetails);
		}
		user.identity.$promise.then(initScope);
		$scope.genderOptions = {
			1: 'vrouw',
			2: 'man',
			3: 'anders',
		};
		$scope.educationLevelList = educationLevelList;
		$scope.maritalStatusList = maritalStatusList;
		function submitSuccess() {
			$location.url('/profiel');
		}
		function submitFail(xhr) {
			console.log(xhr);
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
			if (angular.element(document.querySelector('#portrait')).val()) {
				var formElement = document.querySelector('#main-form');
				$scope.my.$update(formElement).then(submitSuccess, submitFail);
			} else {
				$scope.my.$updateNoImage().then(submitSuccess, submitFail);
			}
		};
	},
])