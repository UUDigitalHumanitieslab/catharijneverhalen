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
				cache: true,
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
		return $resource('/api/url-attachments/', {url: '@url'}, {
			get: {
				url: ':url',
				method: 'get',
			},
			update: {
				url: ':url',
				method: 'put',
			},
			'delete': {
				url: ':url',
				method: 'delete',
			},
		});
	},
]).factory('imageAttachment', [
	'$resource', '$http', '$q',
	function imageAttachmentService($resource, $http, $q) {
		// This resource is special, as the save method takes a form as data.
		var base = '/api/image-attachments/';
		var service = $resource(base, {url: '@url'}, {
			get: {
				url: ':url',
				method: 'get',
			},
			update: undefined,
			'delete': {
				url: ':url',
				method: 'delete',
			},
		});
		service.save = function saveImage(params, form, success, fail) {
			var formData = new FormData(form);
			var result = new service();
			result.$resolved = false;
			result.$promise = $http.post(base, formData, {
				headers: {'Content-Type': undefined},
				transformRequest: angular.identity,
			}).then(function saveSuccess(attachment) {
				_.assign(result, attachment);
				return result;
			});
			result.$promise.then(success, fail).finally(function saveResolve() {
				result.$resolved = true;
			});
			return result;
		};
		return service;
	},
]);
