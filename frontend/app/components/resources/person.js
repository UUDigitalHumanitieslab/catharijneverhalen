'use strict';

angular.module('catharijne.person', [
	'catharijne.resource',
]).factory('person', [
	'$resource', 'appendTransform',
	function personServiceFactory($resource, appendTransform) {
		function unwrapPaginated(data, headers, status) {
			if (200 <= status && status < 300 && data.results) {
				return data.results;
			}
			return data;
		}
		return $resource(':url', {url: '@url'}, {
			query: {
				url: '/api/persons/',
				method: 'get',
				isArray: true,
				transformResponse: appendTransform.response(unwrapPaginated),
			},
		});
	},
]);
