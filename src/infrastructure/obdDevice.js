const OBDReader = require('../../lib/obd.js');
const config = require('dotenv').config();
var EventEmitter = require('events').EventEmitter;
var util = require('util');

module.exports = class ObdDevice extends EventEmitter {
  static createNull() {
    return new ObdDevice(new NullObdDevice());
  }

  constructor(obd) {
    super();
    this._obd = obd;

    this._obd.on('connected', () => {
      _this._handleConnected();
    });
  }

  simulateConnect() {
    this._handleConnected();
  }

  _handleConnected() {
    this._obd.connected = true;
    this.emit('myConnected');
  }

  isConnected() {
    return this._obd.connected;
  }
};

class NullObdDevice extends EventEmitter {

}
