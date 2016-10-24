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
			var parts = input.split('\n\n');
			return _.map(parts, function format(text) {
				var result = {
					'text': text,
					'format': 'paragraph',
				};
				if (text.trim().split(/\s+/, 12).length < 10) {
					result.format = 'header';
				}
				return result;
			});
		}
		$scope.story = story.get({pk: $routeParams.pk});
		$scope.story.$promise.then(function getSubject(storyInstance) {
			$scope.subject = object.get({url: storyInstance.subject});
			$scope.formatContent = formatStory(storyInstance.content);
		});
	},
]);
