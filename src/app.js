const { ObdDevice } = require('./infrastructure/obdDevice');
const CommandLine = require('./infrastructure/commandLine');
const { ObdMonitor } = require('./obdMonitor');
const { Config } = require('./model/config');
const { FileSystem } = require('./infrastructure/fileSystem');

const PID_FILE_ARG = 0
const REQUIRED_ARGS = 1

module.exports = class App {
  constructor(
      cli = CommandLine.create(), 
      obd = ObdDevice.create())
  {
    this.cli = cli;
    this.obd = obd;
  }

  run() {
    if (this.cli.args().length != REQUIRED_ARGS) {
      this.printUsage()
      return
    }

    const config = new Config(FileSystem.create(this.cli.args()[PID_FILE_ARG]))
    const obdMonitor = new ObdMonitor(this.obd, this.cli, config)
    obdMonitor.process()  
  }

  printUsage() { this.cli.output('Usage: npm start [PID FILE]') }
};
