const { ObdDevice, ObdDeviceEvent } = require('./infrastructure/obdDevice');
const { ResponseState } = require('./responseState');
const ResponsePrinter = require('./responsePrinter');
const Response = require('./model/response');

class ObdMonitor {
  constructor(obd, cli, config) {
    this.obd = obd;
    this.cli = cli;
    this.config = config;
    this.printer = new ResponsePrinter();
    this.responseState = new ResponseState();
  }

  process() {
    this.obd.on(ObdDeviceEvent.CONNECTED, () => {
      this.initObdConfig();
      this.obd.addPollers(this.config.getPids());
      this.obd.startPolling();
    });

    this.obd.on(ObdDeviceEvent.RESPONSE_RECEIVED, (data) => {
      this.updateResponseState(data);
      this.outputTable();
    });

    this.obd.connect();
  }

  initObdConfig() {
    ["ATH1", "ATE1", "ATS1"].map((atCommand) => this.obd.write(atCommand));
  }

  updateResponseState(data) {
    const response = Response(data);
    this.responseState.update(response);
  }

  outputTable() {
    this.cli.clear();
    const table = this.printer.printTable(this.responseState);
    this.cli.output(table);
  }
}

module.exports = {
  ObdMonitor
}
