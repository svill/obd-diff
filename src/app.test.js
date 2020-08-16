const ObdDevice = require('./infrastructure/obdDevice')
const CommandLine = require('./infrastructure/commandLine');
const colors = require('colors');
const App = require('./app');

describe('Application', () => {
  test('should run and connect to obd device', () => {
    const obd = ObdDevice.createNull('my_address', 10);
    const app = new App(null, obd);
    app.run();

    expect(obd.isConnected()).toBe(true);
  });

  test('should send AT config once connected', () => {
    const obd = ObdDevice.createNull('my_address', 10);
    const app = new App(null, obd);
    app.run();

    expect(obd.getLastWrite()).toBe("ATH1");
  });

  test('should print obd data response to console', () => {
    const obd = ObdDevice.createNull('my_address', 10);
    const cli = CommandLine.createNull();
    const app = new App(cli, obd);
    app.run();

    obd.simulateMessageReceived('7E8 07 6113 02 14 B9 02 03')

    expect(cli.getLastOutput()).toBe('7E8 07 6113 02 14 B9 02 03');
  });
});