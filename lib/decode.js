import suncalc from 'suncalc';

function readUInt8LE(bytes) {
  // eslint-disable-next-line no-bitwise
  return (bytes & 0xFF);
}

function readUInt16LE(bytes) {
  // eslint-disable-next-line no-bitwise
  const value = (bytes[1] << 8) + bytes[0];
  // eslint-disable-next-line no-bitwise
  return (value & 0xFFFF);
}

function readInt16LE(bytes) {
  const ref = readUInt16LE(bytes);
  // eslint-disable-next-line no-bitwise
  return (ref > 0x7FFF) ? ref - 0x10000 : ref;
}

function decodeLoadVoltage(byte1, byte2) {
  // eslint-disable-next-line no-bitwise
  return ((byte1 << 2) & 0x1C) | ((byte2 >> 6) & 0x3) + 18;
}

function decodePastPosition(bytes) {
  const UNIX_TIME_ON_1_JAN_2020 = 1577840461;

  // eslint-disable-next-line no-bitwise
  const latitude = (readUInt16LE(bytes.slice(0, 2)) * 0xFFFF) / 1e7;

  // eslint-disable-next-line no-bitwise
  const longitude = (readUInt16LE(bytes.slice(2, 4)) * 0xFFFF) / 1e7;

  // eslint-disable-next-line no-bitwise
  const altitude = (readUInt16LE(bytes.slice(4, 6)) * 0xFF) / 1000;

  const tsUnix = (
    (readUInt8LE(bytes[6]) & 0xFF) // eslint-disable-line no-bitwise
  | ((readUInt8LE(bytes[7]) & 0xFF) << 8) // eslint-disable-line no-bitwise
  | ((readUInt8LE(bytes[8]) & 0xFF) << 16) // eslint-disable-line no-bitwise
  ) * 60 + UNIX_TIME_ON_1_JAN_2020;

  return {
    latitude,
    longitude,
    altitude,
    tsUnix,
  };
}

export function decode(bytes, receivedTimestamp) {
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
    pastPositions.push(result);
  }
  const longitude = (readInt16LE(bytes.slice(7, 9)) * 0xffff) / 1e7;
  const latitude = (readInt16LE(bytes.slice(5, 7)) * 0xffff) / 1e7;
  const date = new Date(receivedTimestamp);
  const solarElevtationRads = suncalc.getPosition(date, latitude, longitude).altitude;
  const solarElevtationDeg = (solarElevtationRads * 180) / Math.PI;

  return {
    longitude,
    latitude,
    altitude: readUInt16LE(bytes.slice(9, 11)),
    // eslint-disable-next-line no-bitwise
    sats: (bytes[3] >> 3) & 0x1F,
    // eslint-disable-next-line no-bitwise
    pressure: ((bytes[2] >> 1) & 0x7F) * 10,
    // eslint-disable-next-line no-bitwise
    app_ack: bytes[2] & 0x01,
    // eslint-disable-next-line no-bitwise
    reset_cnt: bytes[3] & 0x7,
    boardTemp: readInt16LE(bytes.slice(4, 5)),
    // eslint-disable-next-line no-bitwise
    noloadVoltage: (((bytes[0] >> 3) & 0x1F) + 18) / 10,
    loadVoltage: decodeLoadVoltage(bytes[0], bytes[1]) / 10,
    // eslint-disable-next-line no-bitwise
    days_of_playback: bytes[1] & 0x3F,
    pastPositions,
    solarElevtationDeg,
  };
}
