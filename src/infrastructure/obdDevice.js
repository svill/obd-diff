const OBDReader = require('../../lib/obd.js');
var EventEmitter = require('events').EventEmitter;
var config = require('dotenv').config();

const OBD_READER_EVENT_CONNECTED = 'connected';
const OBD_READER_EVENT_RESPONSE_RECEIVED = 'responseReceived';

module.exports = class ObdDevice extends EventEmitter {
  MAX_WRITE_HISTORY = 5  

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
      this.emit('myConnected');
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
    this.emit('myResponseReceived', data);
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
    this._storeWriteHistory(message);
  }

  _storeWriteHistory(message) {
    this._writeHistory.unshift(message);
    this._removeExcessWriteHistory();
  }

  _removeExcessWriteHistory() {
    if (this._writeHistory.length > this.MAX_WRITE_HISTORY) {
      this._writeHistory.pop()
    }
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
