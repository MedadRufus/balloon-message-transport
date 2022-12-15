/*
 * Created Date: Wednesday, July 7th 2021, 11:43:21 pm
 * Author: Medad Newman
 * This is the payload formatter used in the things network to
 * decode the uplink into human readable fields
 */

/* ******************************************
* bytes to number
******************************************* */

// eslint-disable-line strict

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

function decode(bytes) {
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
      noloadVoltage: ((bytes[0] >> 3) & 0x1F) + 18, // eslint-disable-line no-bitwise
      loadVoltage: decodeLoadVoltage(bytes[0], bytes[1]),
      days_of_playback: bytes[1] & 0x3F, // eslint-disable-line no-bitwise
    },
  };
}

module.exports = {
  decode,
};
