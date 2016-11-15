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
			if (storyInstance.image_attachments.length) {
				presentation.imageUrl = storyInstance.image_attachments[0].attachment;
			} else if (storyInstance.subject) {
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
			if ($scope.memories.length) {
				$scope.bannerSelection = _.sample($scope.memories);
				if ($routeParams.author_id) {
					$scope.author = storyList[0].username;
				}
				if ($routeParams.subject) {
					object.get({
						url: storyList[0].subject,
					}).$promise.then(function subjectTitleFetch(objectInstance) {
						$scope.subjectTitle = objectInstance.title;
					});
				}
			}
		}
		var search = _.pick($routeParams, ['author_id', 'subject']);
		story.query(search).$promise.then(prepareMemories);
	},
]);
