const { ObdDevice, ObdDeviceEvent } = require('./infrastructure/obdDevice');
const CommandLine = require('./infrastructure/commandLine');
const { ResponseState } = require('./responseState');
const ResponsePrinter = require('./responsePrinter');
const Response = require('./model/response');

class ObdMonitor {
  constructor(obd, cli) {
    this.obd = obd
    this.cli = cli
    this.printer = new ResponsePrinter();
    this.responseState = new ResponseState()
  }

  process() {
    this.obd.on(ObdDeviceEvent.CONNECTED, () => {
      this.obd.write('ATH1')
      this.obd.write('ATE1')
      this.obd.write('ATS1')

      const pids = ['pid1', 'pid2']
      this.obd.pollPids(pids)
  
      this.obd.startPolling()
    })

    this.obd.on(ObdDeviceEvent.RESPONSE_RECEIVED, (data) => {
      const response = Response(data)
      this.responseState.update(response)
      this.cli.clear()
      const table = this.printer.printTable(this.responseState)
      this.cli.output(table)
    });

    this.obd.connect()
  }
}

module.exports = {
  ObdMonitor
}
