require('events').EventEmitter;
const ResponseState = require('./responseState');
const ResponsePrinter = require('./responsePrinter');
const Response = require('./model/response');

module.exports = class App {
  constructor(cli, obd) {
    this.cli = cli;
    this.obd = obd;
    this.printer = new ResponsePrinter();
    this.responseState = new ResponseState()
  }

  run() {
    this.obd.on('myConnected', () => {
      this.obd.write('ATH1');
      this.obd.write('ATE1')
    });
    this.obd.connect();

    this.obd.on('myResponseReceived', (data) => {
      const response = Response(data)
      this.responseState.update(response)
      const table = this.printer.printTable(this.responseState)
      this.cli.output(table)
    });
  }
};
