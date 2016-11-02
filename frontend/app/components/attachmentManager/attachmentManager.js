'use strict';

angular.module('catharijne.attachmentManager', [
]).directive('appAttachmentManager', function attachmentManagerDirective() {
	return {
		templateUrl: 'components/attachmentManager/attachmentManager.html',
		scope: {
			meta: '<',
			fieldList: '<',
			itemList: '=*',
		},
		controller: 'AttachmentMgrCtrl',
		replace: true,
		transclude: true,
	};
}).controller('AttachmentMgrCtrl', [
	'$scope', '$element',
	function attachmentManagerController($scope, $element) {
		var Attachment = $scope.meta.resource;
		var createParams = $scope.meta.request.createParams;
		var updateParams = $scope.meta.request.updateParams;
		var deleteParams = $scope.meta.request.deleteParams;
		function formName(index) {
			return 'form_' + index;
		}
		function formCtrl(index) {
			return $scope[formName(index)];
		}
		function formElem(index) {
			return $element[0].querySelector('#' + formName(index));
		}
		function remove(item, index) {
			if (item[$scope.meta.identifier]) item.$remove(deleteParams(item));
			$scope.itemList.splice(index, 1);
		}
		function resolveItem(item) {
			item.$pending = false;
			return item;
		}
		function submitForm(item, index) {
			item.$pending = true;
			var form = formElem(index);
			item.$save(form).then(resolveItem, console.log);
		}
		function submitResource(item, index) {
			_.defaults(item, $scope.meta.defaults);
			item.$pending = true;
			if (item[$scope.meta.identifier]) {
				item.$update(updateParams(item)).then(resolveItem, console.log);
			} else {
				item.$save(createParams(item)).then(resolveItem, console.log);
			}
		}
		function insertNew() {
			$scope.itemList.push(new Attachment());
		}
		$scope.formName = formName;
		$scope.formCtrl = formCtrl;
		$scope.remove = remove;
		$scope.submitForm = submitForm;
		$scope.submitResource = submitResource;
		$scope.insertNew = insertNew;
	},
]);
