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

    test('should connect with env var address and channel', () => {
      const obd = ObdDevice.createNull('my_address', 10);

      obd.connect();
      
      expect(obd.getAddress()).toBe('my_address');
      expect(obd.geChannel()).toBe(10);
    });
  });
});
