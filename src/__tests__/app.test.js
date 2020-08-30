"use strict"

const { ObdDevice, ObdDeviceEvent } = require('../infrastructure/obdDevice')
const CommandLine = require('../infrastructure/commandLine');
const colors = require('colors');
const App = require('../app');

describe('Application', () => {
  describe('on connect', () => {
    test('should send AT config once connected', () => {
      const obd = ObdDevice.createNull('my_address', 10);
      const app = new App(null, obd);
      const sentMessages = trackSentMessages(obd) 
  
      app.run();
  
      expect(obd.isConnected()).toBe(true);
      expect(sentMessages).toContain("ATH1");
      expect(sentMessages).toContain('ATE1')
      expect(sentMessages).toContain('ATS1')
    });
  
    test('should read PIDs from file', () => {
      const obd = ObdDevice.createNull('my_address', 10);
      const cli = CommandLine.createNull();
      // const fs = FileSystem.createNull('pid1');
      const app = new App(cli, obd);
  
      app.run();
      
      expect(obd.getActivePollers()).toContain("pid1");
      expect(obd.getActivePollers()).toContain("pid2");
    });
  
    test('should call startPolling on Obd connect', () => {
      const obd = ObdDevice.createNull('my_address', 10);
      const cli = CommandLine.createNull();
      const app = new App(cli, obd);
      this.eventTriggered = false;
      obd.on(ObdDeviceEvent.STARTED_POLLING, () => { this.eventTriggered = true; });
  
      app.run();
      
      expect(this.eventTriggered).toBeTruthy();
    }); 
  })

  test('should clear and print obd data response to console', () => {
    const obd = ObdDevice.createNull('my_address', 10);
    const cli = CommandLine.createNull();
    const app = new App(cli, obd);
    
    app.run();

    obd.simulateResponseReceived(['pid1','AABBCCDDEEFF00112233'])
    obd.simulateResponseReceived(['pid1','AABBCCDD99FF00112233'])
    obd.simulateResponseReceived(['pid2','00112233445566778899'])
    
    expect(cli.getLastOutput()).toBe(
      `pid1 | AABBCCDD${'99'.blue}FF00112233\n` +
      `pid2 | 00112233445566778899\n`
    );
    expect(cli.getClearedCount()).toBe(3)
  });

  function trackSentMessages(obd) {
    const sentMessages = []
    obd.on(ObdDeviceEvent.WRITE_MSG, (message) => {
      sentMessages.push(message)
    })
    return sentMessages;
  }
});