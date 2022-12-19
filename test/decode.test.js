import { equal } from 'assert';
import { describe, it } from 'mocha';

import { decode as _decode } from '../lib/decode.js';

describe('decoding test suite', () => {
  it('Decode bad stripe size', () => {
    // convert from base64 to bytearray
    const test_string = "c4CwIQ6rHt3/VgCrHt3/cgDgOxKrHt3/WwAcPBKrHt3/cgDgOxKrHt3/WwAcPBI=";
    const test_string_array = Buffer.from(test_string, 'base64');
    const results = _decode(test_string_array);
    equal(26, results.sats);
  });
});
