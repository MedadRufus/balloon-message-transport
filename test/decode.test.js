import { equal } from 'assert';
import { describe, it } from 'mocha';

import { decode as _decode } from '../lib/decode.js';

describe('decoding test suite', () => {
  // convert from base64 to bytearray
  const testString = 'nMsAMQXxHrsAjg36HtEATgCmTxD6HtEAKADCPxD6HtEAPAAbDRD6HtEAQQDWKBA=';
  const testStringArray = Buffer.from(testString, 'base64');

  it('Decode frame', () => {
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

    /* Past position altitudes */
    equal(19.89, results.data.pastPositions[0].altitude);
    equal(10.2, results.data.pastPositions[1].altitude);
    equal(15.3, results.data.pastPositions[2].altitude);
    equal(16.575, results.data.pastPositions[3].altitude);

    /* Past position longitudes */
    equal(1.3696815, results.data.pastPositions[0].longitude);
    equal(1.3696815, results.data.pastPositions[1].longitude);
    equal(1.3696815, results.data.pastPositions[2].longitude);
    equal(1.3696815, results.data.pastPositions[3].longitude);

    /* Past position latitudes */
    equal(51.969255, results.data.pastPositions[0].latitude);
    equal(51.969255, results.data.pastPositions[1].latitude);
    equal(51.969255, results.data.pastPositions[2].latitude);
    equal(51.969255, results.data.pastPositions[3].latitude);

    /* Past position unix timestamps */
    equal(1641978421, results.data.pastPositions[0].tsUnix);
    equal(1641734341, results.data.pastPositions[1].tsUnix);
    equal(1640956321, results.data.pastPositions[2].tsUnix);
    equal(1641382261, results.data.pastPositions[3].tsUnix);
  });
});
