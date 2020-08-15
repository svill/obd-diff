const OBDReader = require('../../lib/obd.js');
var EventEmitter = require('events').EventEmitter;

const OBD_READER_EVENT_CONNECTED = 'connected';

module.exports = class ObdDevice extends EventEmitter {
  static createNull() {
    return new ObdDevice(new NullObdDevice());
  }

  constructor(obd) {
    super();
    this._obd = obd;

    this._obd.on(OBD_READER_EVENT_CONNECTED, () => {
      this.emit('myConnected');
    });
  }

  connect() {
    this._obd.connect();
  }

  isConnected() {
    return this._obd.connected;
  }
};

class NullObdDevice extends EventEmitter {
  connect() {
    this.connected = true;
    this.emit(OBD_READER_EVENT_CONNECTED);
  }
}
