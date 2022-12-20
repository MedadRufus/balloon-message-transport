import { equal } from 'assert';
import { describe, it } from 'mocha';

import { decode as _decode } from '../lib/decode.js';

describe('decoding test suite', () => {
  // convert from base64 to bytearray
  const testString = 'nMsAMQXxHrsAjg36HtEATgCmTxD6HtEAKADCPxD6HtEAPAAbDRD6HtEAQQDWKBA=';
  const received_timestamp = 1641996018484;
  const testStringArray = Buffer.from(testString, 'base64');

  it('Decode frame', () => {
    const results = _decode(testStringArray, received_timestamp);
    equal(1.2255045, results.longitude);
    equal(51.9102735, results.latitude);
    equal(3470, results.altitude);
    equal(6, results.sats);
    equal(0, results.pressure);
    equal(0, results.app_ack);
    equal(1, results.reset_cnt);
    equal(5, results.boardTemp);
    equal(3.7, results.noloadVoltage);
    equal(2.1, results.loadVoltage);
    equal(11, results.days_of_playback);
    equal(28, results.solarElevtationRads);

    /* Past position altitudes */
    equal(19.89, results.pastPositions[0].altitude);
    equal(10.2, results.pastPositions[1].altitude);
    equal(15.3, results.pastPositions[2].altitude);
    equal(16.575, results.pastPositions[3].altitude);

    /* Past position longitudes */
    equal(1.3696815, results.pastPositions[0].longitude);
    equal(1.3696815, results.pastPositions[1].longitude);
    equal(1.3696815, results.pastPositions[2].longitude);
    equal(1.3696815, results.pastPositions[3].longitude);

    /* Past position latitudes */
    equal(51.969255, results.pastPositions[0].latitude);
    equal(51.969255, results.pastPositions[1].latitude);
    equal(51.969255, results.pastPositions[2].latitude);
    equal(51.969255, results.pastPositions[3].latitude);

    /* Past position unix timestamps */
    equal(1641978421, results.pastPositions[0].tsUnix);
    equal(1641734341, results.pastPositions[1].tsUnix);
    equal(1640956321, results.pastPositions[2].tsUnix);
    equal(1641382261, results.pastPositions[3].tsUnix);
  });
});
