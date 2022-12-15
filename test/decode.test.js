import { equal } from 'assert';
import { describe, it } from 'mocha';

import { decode as _decode } from '../lib/decode.js';

describe('decoding test suite', () => {
  it('Decode bad stripe size', () => {
    const results = _decode([0x23, 0x23]);
    equal(26, results.sats);
  });
});
