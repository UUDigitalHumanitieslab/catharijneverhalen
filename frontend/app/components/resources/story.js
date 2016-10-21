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
]).service('urlAttachment', [
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
]).service('imageAttachment', [
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
