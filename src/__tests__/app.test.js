"use strict"

const { ObdDevice } = require('../infrastructure/obdDevice')
const CommandLine = require('../infrastructure/commandLine');
const App = require('../app');

describe('Application', () => {
  test('should get configs, connect to Obd; observe responses; and output', () => {
    const obd = ObdDevice.createNull('my_address', 10);
    const cli = CommandLine.createNull([__dirname + '/pids.txt']);
    const app = new App(cli, obd);
    
    app.run();
    obd.simulateResponseReceived(['pid1','AABBCCDDEEFF00112233'])
    
    expect(obd.isConnected()).toBe(true);
    expect(obd.getActivePollers()).toEqual(['pid1', 'pid2', 'pid3'])
    expect(cli.getLastOutput()).toBe(
      `pid1 | AABBCCDDEEFF00112233\n`
    );
  })

  test('should print usage when given insufficient command line args', () => {
    const cli = CommandLine.createNull([]);
    const app = new App(cli);
    
    app.run();
    
    expect(cli.getLastOutput()).toBe('Usage: npm start [PID FILE]');
  })
});