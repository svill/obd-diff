const { ObdDevice, ObdDeviceEvent } = require('./infrastructure/obdDevice');
const CommandLine = require('./infrastructure/commandLine');
const { ResponseState } = require('./responseState');
const ResponsePrinter = require('./responsePrinter');
const Response = require('./model/response');
const { Config } = require('./model/config');

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
      this.obd.addPollers(this.getPids());
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

  getPids() {
    return this.config.getPids();
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
