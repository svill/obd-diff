const ObdDevice = require('../infrastructure/obdDevice')
const CommandLine = require('../infrastructure/commandLine');
const colors = require('colors');
const App = require('../app');

describe('Application', () => {
  test('should send AT config once connected', () => {
    const obd = ObdDevice.createNull('my_address', 10);
    const app = new App(null, obd);
    app.run();

    expect(obd.isConnected()).toBe(true);
    expect(obd.getWriteHistory()).toContain("ATH1");
    expect(obd.getWriteHistory()).toContain('ATE1')
  });

  test('should print obd data response to console', () => {
    const obd = ObdDevice.createNull('my_address', 10);
    const cli = CommandLine.createNull();
    const app = new App(cli, obd);
    app.run();

    obd.simulateResponseReceived('2113,7E8 07 6113 02 14 B9 02 03')

    expect(cli.getLastOutput()).toBe('7E8 07 6113 02 14 B9 02 03');
  });
});