'use strict';

angular.module('catharijne.person', [
	'catharijne.resource',
]).factory('person', [
	'$resource', 'appendTransform', 'extractPk',
	function personServiceFactory($resource, appendTransform, extractPk) {
		function augment(data, headers, status) {
			if (!status || 200 <= status && status < 300) {
				if (data.url) data.pk = extractPk(data.url);
				// Use birth_date as the single source of truth.
				if (data.birth_year && !data.birth_date) {
					data.birth_date = data.birth_year;
					data.birth_year = null;
				}
			}
			return data;
		}
		function unaugment(data, headers) {
			if (data.birth_date && data.birth_date.length === 4) {
				data.birth_year = data.birth_date;
				data.birth_date = null;
			}
			return data;
		}
		function unwrapPaginated(data, headers, status) {
			if (200 <= status && status < 300 && data.results) {
				return _.map(data.results, augment);
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
				transformResponse: appendTransform.response(augment),
			},
		});
	},
]);
