import { equal } from 'assert';
import { describe, it } from 'mocha';

import { decode as _decode } from '../lib/decode.js';

describe('decoding test suite', () => {
  // convert from base64 to bytearray
  const testString = 'nMsAMQXxHrsAjg36HtEATgCmTxD6HtEAKADCPxD6HtEAPAAbDRD6HtEAQQDWKBA=';
  const testStringArray = Buffer.from(testString, 'base64');

  it('Decode packet', () => {
    const results = _decode(testStringArray);
    equal(1.2255045, results.data.longitude);
    equal(51.9102735, results.data.latitude);
    equal(3470, results.data.altitude);
    equal(6, results.data.sats);
    equal(0, results.data.pressure);
    equal(0, results.data.app_ack);
    equal(1, results.data.reset_cnt);
    equal(5, results.data.boardTemp);
    equal(3.7, results.data.noloadVoltage);
    equal(2.1, results.data.loadVoltage);
    equal(11, results.data.days_of_playback);
  });
});
