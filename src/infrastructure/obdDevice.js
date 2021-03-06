var config = require('dotenv').config();
const EventEmitter = require('events');
const OBDReader = require('../../lib/obd.js');
const OBDReaderEvent = {
  CONNECTED: 'connected',
  RESPONSE_RECEIVED: 'responseReceived',
}

const ObdDeviceEvent = {
  CONNECTED: 'myConnected',
  RESPONSE_RECEIVED: 'myResponseReceived',
  WRITE_MSG: 'myWriteMessage',
  STARTED_POLLING: 'myStartedPolling'
}

const pollInterval = 1000

class ObdDevice extends EventEmitter {

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
    this._listenForObdResponseReceived();
  }

  _listenForObdConnect() {
    this._obd.on(OBDReaderEvent.CONNECTED, () => {
      this.emit(ObdDeviceEvent.CONNECTED);
    });
  }

  _listenForObdResponseReceived() {
    this._obd.on(OBDReaderEvent.RESPONSE_RECEIVED, (data) => {
      this._handleResponseReceived(data);
    });
  }

  simulateResponseReceived(data) {
    this._handleResponseReceived(data);
  }

  _handleResponseReceived(data) {
    this.emit(ObdDeviceEvent.RESPONSE_RECEIVED, data);
  } 

  connect() {
    this._obd.connect(this._process.env.OBD_ADDRESS, this._process.env.OBD_CHANNEL);
  }

  isConnected() { return this._obd.connected; }
  getAddress() { return this._obd.address; }
  getChannel() { return this._obd.channel }

  write(message) {
    this._obd.write(message);
    this.emit(ObdDeviceEvent.WRITE_MSG, message);
  } 

  addPollers(pids) {
    pids.map(pid => this._obd.addPollerString(pid))
  }

  getActivePollers() { return this._obd.activePollers }

  startPolling() {
    this._obd.startPolling(pollInterval)
    this.emit(ObdDeviceEvent.STARTED_POLLING);
  }
};

class NullObdDevice extends EventEmitter {
  constructor() {
    super()
    this.activePollers = []
  }

  connect(address, channel) {
    this.connected = true;
    this.address = address;
    this.channel = channel;
    this.emit(OBDReaderEvent.CONNECTED);
  }

  write(message) { }

  addPollerString(string) {
    this.activePollers.push(string)
  }

  startPolling(interval) { }
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
  ObdDevice,
  ObdDeviceEvent,
}
