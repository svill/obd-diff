const { ObdDevice } = require('./infrastructure/obdDevice');
const CommandLine = require('./infrastructure/commandLine');
const { ObdMonitor } = require('./obdMonitor');
const { Config } = require('./model/config');
const { FileSystem } = require('./infrastructure/fileSystem');

const PID_FILE_ARG = 0

module.exports = class App {
  constructor(
      cli = CommandLine.create(), 
      obd = ObdDevice.create())
  {
    this.cli = cli;
    this.obd = obd;
  }

  run() {
    const config = new Config(FileSystem.create(this.cli.args()[PID_FILE_ARG]))
    const obdMonitor = new ObdMonitor(this.obd, this.cli, config)
    obdMonitor.process()
  }
};
