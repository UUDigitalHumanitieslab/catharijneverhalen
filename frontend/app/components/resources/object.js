'use strict';

angular.module('catharijne.object', [
	'catharijne.resource',
]).service('object', [
	'$resource', 'appendTransform', '$q', 'currentOrigin',
	function($resource, appendTransform, $q, currentOrigin) {
		// This service builds a $resource-like interface.
		var base = currentOrigin + '/app/demo_objects.json';
		function transform(data, headers, status) {
			if (angular.isArray(data) && 200 <= status && status < 300) {
				_.forEach(data, function(obj) {
					obj.url = base + '#' + encodeURIComponent(obj.inventoryID);
				});
			}
			return data;
		}
		var resource = $resource(base, {}, {
			query: {
				method: 'get',
				isArray: true,
				cache: true,
				transformResponse: appendTransform.response(transform),
			},
		});
		var objectList = resource.query();
		var service = {};
		service.query = function(params, success, fail) {
			objectList.$promise.then(success, fail);
			return objectList;
		};
		service.get = function(params, success, fail) {
			var object = {};
			var deferred = $q.defer();
			object.$resolved = false;
			object.$promise = deferred.promise;
			objectList.$promise.then(function getSuccess(list) {
				var match = _.find(list, params);
				if (match) {
					_.assign(object, match);
					object.$resolved = true;
					deferred.resolve(object);
				} else {
					object.$resolved = true;
					deferred.reject({status: 404});
				}
			}, function getFail(xhr) {
				object.$resolved = true;
				deferred.reject(xhr);
				return xhr;
			});
			object.$promise.then(success, fail);
			return object;
		};
		return service;
	},
]);
