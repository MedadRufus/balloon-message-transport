import { equal } from 'assert';
import { describe, it } from 'mocha';

import { decode } from '../index';

describe('decoding test suite', function () {
  it('Decode bad stripe size', function () {
      var results  = decode([0x23, 0x23]);
      equal(26, results.sats);
  });

});
