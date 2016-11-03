'use strict';

angular.module('catharijne.profiel.bewerken', [
	'catharijne.person',
	'catharijne.authRedirect',
	'catharijne.resource',
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
	'$scope', 'user', 'extractPk', 'person', 'parentOccupation', '$location',
	'parentList', 'educationLevelList', 'maritalStatusList', 'wrapWithResource',
	function profileEditController(
		$scope, user, extractPk, person, parentOccupation, $location,
		parentList, educationLevelList, maritalStatusList, wrapWithResource
	) {
		function initDetails(personInstance) {
			if (personInstance.portrait) $scope.portraitFileName = personInstance.portrait.match(/[^/]+$/)[0];
			$scope.parentOccupations.items = _.map(
				personInstance.parent_occupations,
				_.partial(wrapWithResource, _, parentOccupation)
			);
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
		$scope.parentOccupations = {
			meta: {
				title: 'Beroepen van uw ouders',
				info: 'Hier kunt de beroepen van uw ouders of verzorgers invullen.',
				request: {
					createParams: _.noop,
					updateParams: _.noop,
					deleteParams: _.noop,
				},
				resource: parentOccupation,
				identifier: 'pk',
				defaults: {},
			},
			fields: [
				{
					type: 'select',
					options: parentList,
					name: 'parent',
					required: true,
				},
				{
					type: 'text',
					name: 'occupation',
					maxlength: 126,
					placeholder: 'loodgieter',
					required: true,
					size: 20,
				},
			],
			items: [],
		};
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