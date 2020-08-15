const OBDReader = require('../../lib/obd.js');
var EventEmitter = require('events').EventEmitter;

const OBD_READER_EVENT_CONNECTED = 'connected';

module.exports = class ObdDevice extends EventEmitter {
  static createNull(address, channel) {
    return new ObdDevice(new NullObdDevice(), new NullProcess(address, channel));
  }

  constructor(obd, process) {
    super();
    this._obd = obd;
    this._process = process;

    this._obd.on(OBD_READER_EVENT_CONNECTED, () => {
      this.emit('myConnected');
    });
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
