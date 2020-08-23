var EventEmitter = require('events').EventEmitter;
const ResponsePrinter = require('./responsePrinter');
const Response = require('./model/response');

module.exports = class App {
  constructor(cli, obd) {
    this.cli = cli;
    this.obd = obd;
    this.printer = new ResponsePrinter();
  }

  run() {
    this.obd.on('myConnected', () => {
      this.obd.write('ATH1');
      this.obd.write('ATE1')
    });
    this.obd.connect();

    this.obd.on('myResponseReceived', (data) => {
      const response = Response('2113,7E8 07 6113 02 14 B9 02 03');
      const table = this.printer.printRow([response, Response(data)]);
      this.cli.output(table)
    });
  }
};
