const ObdDevice = require('./obdDevice')

describe('ObdDevice', () => {
  describe('connect', () => {
    test('should forward connected event when obd device connects', () => {
      const obd = ObdDevice.createNull();
      obd.on('myConnected', () => {
        eventTriggered = true;
      });

      obd.connect();
      
      expect(eventTriggered).toBe(true);
      expect(obd.isConnected()).toBe(true);
    });
  });
});
