'use strict';

angular.module('catharijne.herinneringen', [
	'catharijne.story',
	'catharijne.blocklist',
	'ngRoute',
]).config([
	'$routeProvider',
	function memoriesConfig($routeProvider) {
		$routeProvider.when('/herinneringen', {
			templateUrl: 'views/herinneringen/herinneringen.html',
			controller: 'MemoriesCtrl',
		});
	},
]).controller('MemoriesCtrl', [
	'story', 'object', '$routeParams', '$scope',
	function memoriesController(story, object, $routeParams, $scope) {
		var synopsisLength = 200;
		function prepareMemory(storyInstance) {
			var presentation = {
				href: '#/herinnering/' + storyInstance.pk,
				linkText: 'Bekijk',
				title: storyInstance.title,
			};
			if (storyInstance.subject) {
				object.get({
					url: storyInstance.subject,
				}).$promise.then(function subjectFetch(objectInstance) {
					presentation.imageUrl = 'image/' + objectInstance.image;
					presentation.supertitle = objectInstance.title;
				});
			}
			if (storyInstance.introduction) {
				var intro = storyInstance.introduction;
				if (intro.length <= synopsisLength) {
					presentation.description = intro;
				} else {
					presentation.description = intro.slice(0, synopsisLength) + '...';
				}
			}
			return presentation;
		}
		function prepareMemories(storyList) {
			$scope.memories = _.map(storyList, prepareMemory);
		}
		story.query().$promise.then(prepareMemories);
	},
]);
