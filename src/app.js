const { ObdDevice } = require('./infrastructure/obdDevice');
const CommandLine = require('./infrastructure/commandLine');
const { ObdMonitor } = require('./obdMonitor');

module.exports = class App {
  constructor(
      cli = CommandLine.create(), 
      obd = ObdDevice.create()) 
  {
    this.cli = cli;
    this.obd = obd;
  }

  run() {
    const obdMonitor = new ObdMonitor(this.obd, this.cli)
    obdMonitor.process()
  }
};
