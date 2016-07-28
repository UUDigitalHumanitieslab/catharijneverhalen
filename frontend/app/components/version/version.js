'use strict';

angular.module('catharijne.version', [
  'catharijne.version.interpolate-filter',
  'catharijne.version.version-directive'
])

.value('version', '0.0.0');
