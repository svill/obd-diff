const { ObdMonitor } = require('../obdMonitor')
const { ObdDevice, ObdDeviceEvent } = require('../infrastructure/obdDevice')
const CommandLine = require('../infrastructure/commandLine');
const colors = require('colors');
const obdDevice = require('../infrastructure/obdDevice');

describe('ObdMonitor', () => {
  describe('process', () => {
    describe('on connect', () => {
      test('should send AT config once connected', () => {
        const obd = ObdDevice.createNull('my_address', 10);
        const sentMessages = trackSentMessages(obd) 
        const obdMonitor = new ObdMonitor(obd)
        
        obdMonitor.process();
    
        expect(obd.isConnected()).toBe(true);
        expect(sentMessages).toContain("ATH1");
        expect(sentMessages).toContain('ATE1')
        expect(sentMessages).toContain('ATS1')
      });

      test('should read PIDs from file', () => {
        const obd = ObdDevice.createNull('my_address', 10);
        const obdMonitor = new ObdMonitor(obd)
    
        obdMonitor.process();
        
        expect(obd.getActivePollers()).toContain("pid1");
        expect(obd.getActivePollers()).toContain("pid2");
      });

      test('should call startPolling on Obd connect', () => {
        const obd = ObdDevice.createNull('my_address', 10);
        const obdMonitor = new ObdMonitor(obd);
        this.eventTriggered = false;
        obd.on(ObdDeviceEvent.STARTED_POLLING, () => { this.eventTriggered = true; });
    
        obdMonitor.process();
        
        expect(this.eventTriggered).toBeTruthy();
      });
    });

    describe('on data received', () => {
      test('should clear and print obd data response to console', () => {
        const obd = ObdDevice.createNull('my_address', 10);
        const cli = CommandLine.createNull();
        const obdMonitor = new ObdMonitor(obd, cli);
        
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
