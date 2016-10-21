'use strict';

angular.module('catharijne.herinnering', [
	'catharijne.story',
	'catharijne.object',
	'ngRoute',
]).config(['$routeProvider', function memoryConfig($routeProvider) {
	$routeProvider.when('/herinnering/:pk', {
		templateUrl: 'views/herinnering/herinnering.html',
		controller: 'MemoryCtrl',
	});
}]).controller('MemoryCtrl', [
	'$scope', 'story', 'object', '$routeParams',
	function memoryController($scope, story, object, $routeParams) {
		function formatStory(input) {
			if (!input) return;
			var replacement = {
				'&': '&amp;',
				'<': '&lt;',
				'>': '&gt;'
			};
			function replaceTag(tag) {
				return replacement[tag] || tag;
			}
			input.replace(/[&<>]/g, replaceTag);
			var parts = input.split('\n\n');
			var formatted = _.map(parts, function format(text) {
				if (text.trim().split(/\s+/, 12).length < 10) {
					return '<h4>' + text + '</h4>';
				}
				return '<p>' + text + '</p>';
			});
			return formatted.join();
		}
		$scope.story = story.get({pk: $routeParams.pk});
		$scope.story.$promise.then(function getSubject(storyInstance) {
			$scope.subject = object.get({url: storyInstance.subject});
			$scope.formattedContent = formatStory(storyInstance.content);
		});
	},
]);
