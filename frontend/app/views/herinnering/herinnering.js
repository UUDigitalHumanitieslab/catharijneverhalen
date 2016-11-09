'use strict';

angular.module('catharijne.herinnering', [
	'catharijne.story',
	'catharijne.object',
	'catharijne.user',
	'catharijne.resource',
	'ngRoute',
]).config(['$routeProvider', function memoryConfig($routeProvider) {
	$routeProvider.when('/herinnering/:pk', {
		templateUrl: 'views/herinnering/herinnering.html',
		controller: 'MemoryCtrl',
	});
}]).controller('MemoryCtrl', [
	'$scope', 'story', 'object', 'user',
	'$routeParams', 'extractPk',
	function memoryController(
		$scope, story, object, user,
		$routeParams, extractPk
	) {
		function isHeader(text) {
			return text.trim().split(/\s+/, 12).length < 10;
		}
		function formatStory(storyInstance) {
			var content = storyInstance.content;
			var sections = [];
			if (!content) return sections;
			var parts = content.split('\n\n');
			var currentSection;
			_.forEach(parts, function format(part) {
				if (isHeader(part)) {
					if (currentSection) sections.push(currentSection);
					currentSection = {header: part, paragraphs: []};
				} else {
					if (!currentSection) currentSection = {paragraphs: []};
					currentSection.paragraphs.push(part);
				}
			});
			sections.push(currentSection);
			var images = storyInstance.image_attachments;
			if (images) {
				_.forEach(sections, function attachImages(section, index) {
					if (index >= images.length) return false;
					var end = index + 1;
					if (end === sections.length) end = images.length;
					section.images = images.slice(index, end);
				});
			}
			return sections;
		}
		$scope.me = user.identity;
		$scope.story = story.get({pk: $routeParams.pk});
		$scope.story.$promise.then(function initDetails(storyInstance) {
			$scope.subject = object.get({
				url: storyInstance.subject
			});
			$scope.subject.$promise.then(function initSubject(objectInstance) {
				$scope.subjectUrl = '#/voorwerp?url=' + encodeURIComponent(objectInstance.url);
			});
			$scope.formatContent = formatStory(storyInstance);
			$scope.authorUrl = '#/herinneringen?author_id=' + extractPk(storyInstance.author);
		});
	},
]);
