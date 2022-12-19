/*
 * Created Date: Wednesday, July 7th 2021, 11:43:21 pm
 * Author: Medad Newman
 * This is the payload formatter used in the things network to
 * decode the uplink into human readable fields
 */

/* ******************************************
* bytes to number
******************************************* */

function readUInt8LE(bytes) {
  return (bytes & 0xFF);
}

function readUInt16LE(bytes) {
  const value = (bytes[1] << 8) + bytes[0]; // eslint-disable-line no-bitwise
  return (value & 0xFFFF); // eslint-disable-line no-bitwise
}

function readInt16LE(bytes) {
  const ref = readUInt16LE(bytes);
  return (ref > 0x7FFF) ? ref - 0x10000 : ref;// eslint-disable-line no-bitwise
}

function decodeLoadVoltage(byte1, byte2) {
  return ((byte1 << 2) & 0x1C) | ((byte2 >> 6) & 0x3) + 18; // eslint-disable-line no-bitwise
}

function decodePastPosition(bytes) {
  const UNIX_TIME_ON_1_JAN_2020 = 1577840461;
  const latitude = readUInt16LE(bytes.slice(0, 2)) * 0xFFFF / 1e7; // eslint-disable-line no-bitwise
  const longitude = readUInt16LE(bytes.slice(2, 4)) * 0xFFFF / 1e7; // eslint-disable-line no-bitwise
  const altitude = readUInt16LE(bytes.slice(4, 6)) * 0xFF / 1000; // eslint-disable-line no-bitwise
  const tsUnix = ((readUInt8LE(bytes[6]) & 0xFF) | ((readUInt8LE(bytes[7]) & 0xFF) << 8) | ((readUInt8LE(bytes[8]) & 0xFF) << 16)) * 60 + UNIX_TIME_ON_1_JAN_2020;
  return {
    position:
    {
      latitude,
      longitude,
      altitude,
      tsUnix,
    },
  };
}

export function decode(bytes) {
  const currentDataSize = 11;
  const pastDataSize = 9;
  const payloadSize = bytes.length;
  const nPastPositions = (payloadSize - currentDataSize) / pastDataSize;
  const pastPositions = [];
  const pastPositionsStartByte = currentDataSize;
  for (let i = 0; i < nPastPositions; i += 1) {
    const startByte = pastPositionsStartByte + i * pastDataSize;
    const endByte = pastPositionsStartByte + (i + 1) * pastDataSize;
    const pastBytes = bytes.slice(startByte, endByte);
    const result = decodePastPosition(pastBytes);
    pastPositions.push(result.position);
  }
  return {
    data: {
      longitude: (readInt16LE(bytes.slice(7, 9)) * 0xffff) / 1e7,
      latitude: (readInt16LE(bytes.slice(5, 7)) * 0xffff) / 1e7,
      altitude: readUInt16LE(bytes.slice(9, 11)),
      sats: (bytes[3] >> 3) & 0x1F, // eslint-disable-line no-bitwise
      pressure: ((bytes[2] >> 1) & 0x7F) * 10, // eslint-disable-line no-bitwise
      app_ack: bytes[2] & 0x01, // eslint-disable-line no-bitwise
      reset_cnt: bytes[3] & 0x7, // eslint-disable-line no-bitwise
      boardTemp: readInt16LE(bytes.slice(4, 5)),
      noloadVoltage: (((bytes[0] >> 3) & 0x1F) + 18) / 10, // eslint-disable-line no-bitwise
      loadVoltage: decodeLoadVoltage(bytes[0], bytes[1]) / 10,
      days_of_playback: bytes[1] & 0x3F, // eslint-disable-line no-bitwise
      pastPositions,
    },
  };
}
