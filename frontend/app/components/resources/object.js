'use strict';

angular.module('catharijne.object', [
	'catharijne.resource',
]).factory('object', [
	'$resource', 'appendTransform', '$q', 'currentOrigin',
	function($resource, appendTransform, $q, currentOrigin) {
		// This service builds a $resource-like interface.
		var base = currentOrigin + '/app/demo_objects.json';
		function transformRaw(data, headers, status) {
			if (angular.isArray(data) && 200 <= status && status < 300) {
				_.forEach(data, function(obj) {
					_.forOwn(obj, function trim(value, key) {
						if (typeof value !== 'string') return;
						obj[key] = value.trim();
					});
					obj.url = base + '#' + encodeURIComponent(obj.inventoryID);
				});
			}
			return data;
		}
		function object2description(obj, enrich) {
			var creator = obj.creator || 'Maker onbekend';
			var dateRange = obj.dateRange || 'datum onbekend';
			var description = {
				url: obj.url,
				imageUrl: 'image/' + obj.image,
				title: obj.title,
				description: creator + ', ' + dateRange,
			};
			enrich(description);
			return description;
		}
		var resource = $resource(base, {}, {
			query: {
				method: 'get',
				isArray: true,
				cache: true,
				transformResponse: appendTransform.response(transformRaw),
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
		service.asDescriptions = function asDescriptions(callback) {
			return objectList.$promise.then(_.partial(_.map, _, _.partial(
				object2description,
				_,
				callback
			)));
		};
		return service;
	},
]);
