const ObdDevice = require('./obdDevice')

describe('ObdDevice', () => {
  describe('connect', () => {
    test('should forward connected event when obd device connects', () => {
      const obd = ObdDevice.createNull();
      obd.on('myConnected', () => {
        triggeredConnected = true;
      });

      obd.simulateConnect();
      
      expect(triggeredConnected).toBe(true);
      expect(obd.isConnected()).toBe(true);
    });
  });
});
