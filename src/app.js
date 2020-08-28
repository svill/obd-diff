const { ObdDevice, ObdDeviceEvent } = require('./infrastructure/obdDevice');
const { ResponseState } = require('./responseState');
const ResponsePrinter = require('./responsePrinter');
const Response = require('./model/response');
const CommandLine = require('./infrastructure/commandLine');

module.exports = class App {
  constructor(
      cli = CommandLine.create(), 
      obd = ObdDevice.create()) 
  {
    this.cli = cli;
    this.obd = obd;
    this.printer = new ResponsePrinter();
    this.responseState = new ResponseState()
  }

  run() {
    this.obd.on(ObdDeviceEvent.CONNECTED, () => {
      this.obd.write('ATH1');
      this.obd.write('ATE1')

      const pids = ['pid1', 'pid2']
      this.obd.pollPids(pids)

      this.obd.startPolling()
    });

    this.obd.on(ObdDeviceEvent.RESPONSE_RECEIVED, (data) => {
      const response = Response(data)
      this.responseState.update(response)
      const table = this.printer.printTable(this.responseState)
      this.cli.output(table)
    });

    this.obd.connect();
  }
};
