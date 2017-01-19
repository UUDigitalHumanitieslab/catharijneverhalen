'use strict';

describe('catharijne.version module', function() {
  beforeEach(module('catharijne.version'));

  describe('version service', function() {
    it('should return current version', inject(function(version) {
      expect(version).toEqual('1.0.0');
    }));
  });
});
