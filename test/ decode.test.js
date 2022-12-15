const assert = require('assert');
const mocha = require('mocha');

const ecstream = require('../index');

mocha.describe('decoding test suite', function () {
  mocha.it('Decode bad stripe size', function (done) {
    try {
      var results  = ecstream.decode([0x23, 0x23]);
      assert.ok(undefined); // Unreachable
    } catch (error) {
      assert.ok(error instanceof assert.AssertionError);
      done();
    }
  });

});
