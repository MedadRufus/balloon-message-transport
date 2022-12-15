const assert = require('assert');
const mocha = require('mocha');

const decode = require('../lib/decode');

mocha.describe('decoding test suite', () => {
  mocha.it('Decode bad stripe size', () => {
    const results = decode.decode([0x23, 0x23]);
    assert.equal(26, results.sats);
  });
});
