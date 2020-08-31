"use strict"

const { ObdDevice } = require('../infrastructure/obdDevice')
const CommandLine = require('../infrastructure/commandLine');
const colors = require('colors');
const App = require('../app');

describe('Application', () => {
  test('should get configs, connect to Obd; observe responses; and output', () => {
    const obd = ObdDevice.createNull('my_address', 10);
    const cli = CommandLine.createNull();
    const app = new App(cli, obd);
    
    app.run();
    obd.simulateResponseReceived(['pid1','AABBCCDDEEFF00112233'])
    
    expect(obd.isConnected()).toBe(true);
    expect(cli.getLastOutput()).toBe(
      `pid1 | AABBCCDDEEFF00112233\n`
    );
  })
});