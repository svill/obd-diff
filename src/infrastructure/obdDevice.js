const OBDReader = require('../../lib/obd.js');
var EventEmitter = require('events').EventEmitter;
var config = require('dotenv').config();

const OBD_READER_EVENT_CONNECTED = 'connected';
const OBD_READER_EVENT_MSG_RECEIVED = 'messageReceived';

module.exports = class ObdDevice extends EventEmitter {
  static createNull(address, channel) {
    return new ObdDevice(new NullObdDevice(), new NullProcess(address, channel));
  }

  static create() {
    return new ObdDevice(new OBDReader(), process);
  }

  constructor(obd, process) {
    super();
    this._obd = obd;
    this._process = process;
    this._listenForObdConnect();
    this._listenForObdMsgReceived();
  }

  _listenForObdConnect() {
    this._obd.on(OBD_READER_EVENT_CONNECTED, () => {
      this.emit('myConnected');
    });
  }

  _listenForObdMsgReceived() {
    this._obd.on(OBD_READER_EVENT_MSG_RECEIVED, (data) => {
      this._handleMessageReceived(data);
    });
  }

  simulateMessageReceived(data) {
    this._handleMessageReceived(data);
  }

  _handleMessageReceived(data) {
    this.emit('myMessageReceived', data);
  } 

  connect() {
    this._obd.connect(this._process.env.OBD_ADDRESS, this._process.env.OBD_CHANNEL);
  }

  isConnected() { return this._obd.connected; }
  getAddress() { return this._obd.address; }
  geChannel() { return this._obd.channel }
};

class NullObdDevice extends EventEmitter {
  connect(address, channel) {
    this.connected = true;
    this.address = address;
    this.channel = channel;
    this.emit(OBD_READER_EVENT_CONNECTED);
  }
}

class NullProcess {
  constructor(address, channel) {
    this.env = {
      'OBD_ADDRESS': address,
      'OBD_CHANNEL': channel,
    };
  } 
}
