import { equal } from 'assert';
import { expect } from 'chai';
import { describe, it } from 'mocha';
import { decode as _decode } from '../lib/decode.js';

describe('decoding test suite', () => {
  // convert from base64 to bytearray
  const testString = 'nMsAMQXxHrsAjg36HtEATgCmTxD6HtEAKADCPxD6HtEAPAAbDRD6HtEAQQDWKBA=';
  const receivedTimestamp = 1641996018484;
  const testStringArray = Buffer.from(testString, 'base64');

  it('Decode frame', () => {
    const results = _decode(testStringArray, receivedTimestamp);
    expect(results.longitude).to.be.closeTo(1.2255045, 0.00001);
    expect(results.latitude).to.be.closeTo(51.9102735, 0.00001);
    equal(3470, results.altitude);
    equal(6, results.sats);
    equal(0, results.pressure);
    equal(0, results.app_ack);
    equal(1, results.reset_cnt);
    equal(5, results.boardTemp);
    equal(3.7, results.noloadVoltage);
    equal(2.1, results.loadVoltage);
    equal(11, results.days_of_playback);
    expect(results.solarElevtationDeg).to.be.closeTo(12.15, 0.01);

    /* Past position altitudes */
    expect(results.pastPositions[0].altitude).to.be.closeTo(19.89, 1);
    expect(results.pastPositions[1].altitude).to.be.closeTo(10.2, 1);
    expect(results.pastPositions[2].altitude).to.be.closeTo(15.3, 1);
    expect(results.pastPositions[3].altitude).to.be.closeTo(16.575, 1);

    /* Past position longitudes */
    expect(results.pastPositions[0].longitude).to.be.closeTo(1.3696815, 0.00001);
    expect(results.pastPositions[1].longitude).to.be.closeTo(1.3696815, 0.00001);
    expect(results.pastPositions[2].longitude).to.be.closeTo(1.3696815, 0.00001);
    expect(results.pastPositions[3].longitude).to.be.closeTo(1.3696815, 0.00001);

    /* Past position latitudes */
    expect(results.pastPositions[0].latitude).to.be.closeTo(51.969255, 0.00001);
    expect(results.pastPositions[1].latitude).to.be.closeTo(51.969255, 0.00001);
    expect(results.pastPositions[2].latitude).to.be.closeTo(51.969255, 0.00001);
    expect(results.pastPositions[3].latitude).to.be.closeTo(51.969255, 0.00001);

    /* Past position unix timestamps */
    equal(1641978421, results.pastPositions[0].tsUnix);
    equal(1641734341, results.pastPositions[1].tsUnix);
    equal(1640956321, results.pastPositions[2].tsUnix);
    equal(1641382261, results.pastPositions[3].tsUnix);
  });
});
