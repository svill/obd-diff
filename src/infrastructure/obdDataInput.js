const OBDReader = require('../../lib/obd.js');

module.exports = class ObdDataInput {
  static createNull(callback) {
    return new ObdDataInput(new ObdDataInputNull(callback));
  }

  static create() {
    return new ObdDataInput(new OBDReader(/* takes callback */));
  }

  constructor(obd) {
    this._obd = obd;
  }

  input(data) {
    this._obd.onDataReceived(data);
    this._lastInput = data;
  }

  getLastInput() {
    return this._lastInput;
  }
};

class ObdDataInputNull {
  constructor(callback) {
    this._callback = callback;
    console.log(this._callback);
  }

  onDataReceived(data) { 
    this._callback.apply(data); 
  }
}
