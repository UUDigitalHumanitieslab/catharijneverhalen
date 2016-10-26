'use strict';

angular.module('catharijne.person', [
	'catharijne.resource',
]).factory('person', [
	'$resource', 'appendTransform', 'extractPk',
	function personServiceFactory($resource, appendTransform, extractPk) {
		function enrichPk(data, headers, status) {
			if ((!status || 200 <= status && status < 300) && data.url) {
				data.pk = extractPk(data.url);
			}
			return data;
		}
		function unwrapPaginated(data, headers, status) {
			if (200 <= status && status < 300 && data.results) {
				return _.map(data.results, enrichPk);
			}
			return data;
		}
		return $resource('/api/persons/' + ':pk/', {pk: '@pk'}, {
			query: {
				method: 'get',
				isArray: true,
				transformResponse: appendTransform.response(unwrapPaginated),
			},
			get: {
				method: 'get',
				transformResponse: appendTransform.response(enrichPk),
			},
		});
	},
]);
