const OBDReader = require('../../lib/obd.js');
var EventEmitter = require('events').EventEmitter;
var config = require('dotenv').config();

const OBD_READER_EVENT_CONNECTED = 'connected';
const OBD_READER_EVENT_RESPONSE_RECEIVED = 'responseReceived';

const OBD_DEVICE_CONNECTED = 'myConnected'
const OBD_DEVICE_RESPONSE_RECEIVED = 'myResponseReceived'
const OBD_DEVICE_WRITE_MSG = 'myWriteMessage'

class ObdDevice extends EventEmitter {

  static createNull(address, channel) {
    return new ObdDevice(new NullObdDevice(), new NullProcess(address, channel));
  }

  static create() {
    return new ObdDevice(new OBDReader(), process);
  }

  constructor(obd, process) {
    super();
    this._writeHistory = []
    this._obd = obd;
    this._process = process;
    this._listenForObdConnect();
    this._listenForObdResponseReceived();
  }

  _listenForObdConnect() {
    this._obd.on(OBD_READER_EVENT_CONNECTED, () => {
      this.emit(OBD_DEVICE_CONNECTED);
    });
  }

  _listenForObdResponseReceived() {
    this._obd.on(OBD_READER_EVENT_RESPONSE_RECEIVED, (data) => {
      this._handleResponseReceived(data);
    });
  }

  simulateResponseReceived(data) {
    this._handleResponseReceived(data);
  }

  _handleResponseReceived(data) {
    this.emit(OBD_DEVICE_RESPONSE_RECEIVED, data);
  } 

  connect() {
    this._obd.connect(this._process.env.OBD_ADDRESS, this._process.env.OBD_CHANNEL);
  }

  isConnected() { return this._obd.connected; }
  getAddress() { return this._obd.address; }
  getChannel() { return this._obd.channel }

  getWriteHistory() { return this._writeHistory; }

  write(message) {
    this._obd.write(message);
    this.emit(OBD_DEVICE_WRITE_MSG, message);
  } 
};

class NullObdDevice extends EventEmitter {
  connect(address, channel) {
    this.connected = true;
    this.address = address;
    this.channel = channel;
    this.emit(OBD_READER_EVENT_CONNECTED);
  }

  write(message) { }
}

class NullProcess {
  constructor(address, channel) {
    this.env = {
      'OBD_ADDRESS': address,
      'OBD_CHANNEL': channel,
    };
  } 
}

module.exports = {
  OBD_DEVICE_CONNECTED,
  OBD_DEVICE_RESPONSE_RECEIVED,
  OBD_DEVICE_WRITE_MSG,
  ObdDevice
}
