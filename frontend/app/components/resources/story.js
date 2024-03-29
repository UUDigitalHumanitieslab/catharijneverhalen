'use strict';

angular.module('catharijne.story', ['catharijne.resource'])
.factory('story', [
	'$resource', 'appendTransform',
	function storyService($resource, appendTransform) {
		function transformStoryOut(data, headers) {
			if (data.year) {
				var years = String(data.year).match(/(\d{4})-(\d{4})/);
				if (years) {
					data.year = Number(years[1]);
					data.year_end = Number(years[2]);
				} else {
					data.year_end = null;
				}
			}
			return data;
		}
		function transformStoryIn(data, headers, status) {
			if (200 <= status && status < 300) {
				if (data.year && data.year_end) {
					data.year = [data.year, data.year_end].join('-');
				}
			}
			return data;
		}
		function transformList(data, headers, status) {
			if (200 <= status && status < 300) {
				data = data.results;
				_.forEach(data, function transformListDetail(item) {
					transformStoryIn(item, headers, status);
				});
			}
			return data;
		}
		return $resource('/api/stories/:pk/', {pk: '@pk'}, {
			query: {
				method: 'get',
				isArray: true,
				cache: true,
				transformResponse: appendTransform.response(transformList),
			},
			get: {
				method: 'get',
				transformResponse: appendTransform.response(transformStoryIn),
			},
			save: {
				method: 'post',
				transformRequest: appendTransform.request(transformStoryOut),
			},
			update: {
				method: 'put',
				transformRequest: appendTransform.request(transformStoryOut),
			},
		});
	},
]).factory('urlAttachment', [
	'$resource',
	function urlAttachmentService($resource) {
		return $resource('/api/url-attachments/:pk/', {pk: '@pk'});
	},
]).factory('imageAttachment', [
	'$resource', '$http', '$q',
	function imageAttachmentService($resource, $http, $q) {
		// This resource is special, as the save method takes a form as data.
		var base = '/api/image-attachments/';
		var service = $resource(base + ':pk/', {pk: '@pk'});
		function saveImage(params, form, success, fail) {
			var formData = new FormData(form);
			var result = this;
			result.$resolved = false;
			result.$promise = $http.post(base, formData, {
				headers: {'Content-Type': undefined},
				transformRequest: angular.identity,
			}).then(function saveSuccess(xhr) {
				_.assign(result, xhr.data);
				return result;
			});
			result.$promise.then(success, fail).finally(function saveResolve() {
				result.$resolved = true;
			});
			return result;
		};
		service.save = function serviceClassSave(params, form, success, fail) {
			var result = new service();
			return _.bind(saveImage, result)(params, form, success, fail);
		};
		service.prototype.$save = function serviceInstanceSave(form, success, fail) {
			return _.bind(saveImage, this, {})(form, success, fail).$promise;
		};
		delete service.update;
		delete service.prototype.$update;
		return service;
	},
]);
