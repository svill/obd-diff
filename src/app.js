const { ObdDevice } = require('./infrastructure/obdDevice');
const CommandLine = require('./infrastructure/commandLine');
const { ObdMonitor } = require('./obdMonitor');
const { Config } = require('./model/config');
const { FileSystem } = require('./infrastructure/fileSystem');

module.exports = class App {
  constructor(
      cli = CommandLine.create(), 
      obd = ObdDevice.create(),
      config = new Config(FileSystem.create(__dirname + '/pids.txt')))
  {
    this.cli = cli;
    this.obd = obd;
    this.config = config
  }

  run() {
    const obdMonitor = new ObdMonitor(this.obd, this.cli, this.config)
    obdMonitor.process()
  }
};
