'use strict';

angular.module('catharijne.person', [
	'catharijne.resource',
]).factory('person', [
	'$resource', '$http', 'appendTransform', 'extractPk',
	function personServiceFactory($resource, $http, appendTransform, extractPk) {
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
		function stripPortraitField(data, headers) {
			return _.omit(data, 'portrait');
		}
		var path = '/api/persons/';
		var person = $resource(path + ':pk/', {pk: '@pk'}, {
			query: {
				method: 'get',
				isArray: true,
				transformResponse: appendTransform.response(unwrapPaginated),
			},
			get: {
				method: 'get',
				transformResponse: appendTransform.response(augment),
			},
			updateNoImage: {
				method: 'patch',
				transformRequest: appendTransform.request([
					stripPortraitField,
					unaugment,
				]),
				transformResponse: appendTransform.response(augment),
			},
		});
		function updatePerson(params, form, success, fail) {
			// Bind to a person instance before use.
			var instance = this;
			var pk = params.pk || instance.pk;
			var formData = new FormData(form);
			var birth_date = formData.get('birth_date');
			if (birth_date && birth_date.length === 4) {
				formData.set('birth_year', birth_date);
				formData.set('birth_date', null);
			}
			instance.$resolved = false;
			instance.$promise = $http.put(path + pk + '/', formData, {
				headers: {'Content-Type': undefined},
				transformResponse: appendTransform.response(augment),
			}).then(function updateSuccess(data) {
				_.assign(instance, data);
				return instance;
			});
			instance.$promise.then(success, fail).finally(function resolve() {
				instance.$resolved = true;
			});
			return instance.$promise;
		}
		// Call instance.$update with the form instead of the parameters.
		person.prototype.$update = _.partial(updatePerson, {});
		person.update = function personUpdate(params, form, success, fail) {
			instance = new person();
			_.bind(updatePerson, instance)(params, form, success, fail);
			return instance;
		};
		return person;
	},
]);
