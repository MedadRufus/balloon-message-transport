import { equal } from 'assert';
import { describe, it } from 'mocha';

import { decode as _decode } from '../lib/decode.js';

describe('decoding test suite', () => {
  // convert from base64 to bytearray
  const testString = 'c4CwIQ6rHt3/VgCrHt3/cgDgOxKrHt3/WwAcPBKrHt3/cgDgOxKrHt3/WwAcPBI=';
  const testStringArray = Buffer.from(testString, 'base64');

  it('Decode sats', () => {
    const results = _decode(testStringArray);
    equal(4, results.data.sats);
  });
});
