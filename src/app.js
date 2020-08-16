var EventEmitter = require('events').EventEmitter;
const ResponsePrinter = require('./responsePrinter');
const Response = require('./response');

module.exports = class App {
  constructor(cli, obd) {
    this.cli = cli;
    this.obd = obd;
    this.printer = new ResponsePrinter(cli);
  }

  run() {
    this.obd.on('myConnected', () => {
      this.obd.write('ATH1');
    });
    this.obd.connect();

    this.obd.on('myMessageReceived', (data) => {
      const response = Response('7E8 07 6113 02 14 B9 02 03').compare(data);
      this.printer.print(response);
    });
  }
};
