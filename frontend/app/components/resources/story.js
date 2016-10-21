'use strict';

angular.module('catharijne.story', ['catharijne.resource'])
.service('story', [
	'$resource', 'appendTransform',
	function storyService($resource, appendTransform) {
		function transform(data, headers, status) {
			if (200 <= status && status < 300) {
				data = data.results;
			}
			return data;
		}
		return $resource('/api/stories/', {}, {
			query: {
				method: 'get',
				isArray: true,
				transformResponse: appendTransform.response(transform),
			},
			get: {
				url: ':url',
				method: 'get',
			},
			update: {
				url: ':url',
				params: {url: '@url'},
				method: 'put',
			},
		});
	},
]);
