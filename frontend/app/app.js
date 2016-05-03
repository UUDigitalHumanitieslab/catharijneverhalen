'use strict';

// Declare app level module which depends on views, and components
angular.module('catharijne', [
  'ngRoute',
  'catharijne.view1',
  'catharijne.view2',
  'catharijne.version'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/view1'});
}]);
