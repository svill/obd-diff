const { ObdMonitor } = require('../obdMonitor')
const { ObdDevice, ObdDeviceEvent } = require('../infrastructure/obdDevice')
const CommandLine = require('../infrastructure/commandLine');
const { Config } = require('../model/config')
const colors = require('colors');

describe('ObdMonitor', () => {
  function createTest({
    obd = ObdDevice.createNull('my_address', 10), 
    cli = CommandLine.createNull(), 
    config = new Config(['pid1', 'pid2'])
  }) {
      return new ObdMonitor(obd, cli, config);
  }
  
  describe('process', () => {
    describe('on connect', () => {
      test('should send AT config once connected', () => {
        const obdMonitor = createTest({})
        const { obd } = obdMonitor
        const sentMessages = trackSentMessages(obd) 
        
        obdMonitor.process();
    
        expect(obd.isConnected()).toBe(true);
        expect(sentMessages).toContain("ATH1");
        expect(sentMessages).toContain('ATE1')
        expect(sentMessages).toContain('ATS1')
      });

      test('should poll PIDs from config', () => {
        const obdMonitor = createTest({ config: new Config(['pid3', 'pid4']) })
        const { obd } = obdMonitor
    
        obdMonitor.process();
        
        expect(obd.getActivePollers()).toContain("pid3");
        expect(obd.getActivePollers()).toContain("pid4");
      });

      test('should call startPolling on Obd connect', () => {
        const obdMonitor = createTest({});
        const { obd } = obdMonitor;
        this.eventTriggered = false;
        obd.on(ObdDeviceEvent.STARTED_POLLING, () => { this.eventTriggered = true; });
    
        obdMonitor.process();
        
        expect(this.eventTriggered).toBeTruthy();
      });
    });

    describe('on data received', () => {
      test('should clear and print obd data response to console', () => {
        const obdMonitor = createTest({});
        const { obd, cli } = obdMonitor;
        
        obdMonitor.process();
    
        obd.simulateResponseReceived(['pid1','AABBCCDDEEFF00112233'])
        obd.simulateResponseReceived(['pid1','AABBCCDD99FF00112233'])
        obd.simulateResponseReceived(['pid2','00112233445566778899'])
        
        expect(cli.getLastOutput()).toBe(
          `pid1 | AABBCCDD${'99'.green}FF00112233\n` +
          `pid2 | 00112233445566778899\n`
        );
        expect(cli.getClearedCount()).toBe(3)
      });
    })
  })

  function trackSentMessages(obd) {
    const sentMessages = []
    obd.on(ObdDeviceEvent.WRITE_MSG, (message) => {
      sentMessages.push(message)
    })
    return sentMessages;
  }
})
