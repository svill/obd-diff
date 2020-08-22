const ObdDevice = require('../obdDevice')

describe('ObdDevice', () => {
  describe('connect', () => {
    test('should forward connected event when obd device connects', () => {
      const obd = ObdDevice.createNull();
      obd.on('myConnected', () => { eventTriggered = true; });

      obd.connect();
      
      expect(eventTriggered).toBe(true);
    });

    test('should connect with env var address and channel', () => {
      const obd = ObdDevice.createNull('my_address', 10);

      obd.connect();
      
      expect(obd.isConnected()).toBe(true);
      expect(obd.getAddress()).toBe('my_address');
      expect(obd.geChannel()).toBe(10);
    });
  });

  describe('responseReceived event', () => {
    test('should forward response received event when obd device receives data', () => {
      const obd = ObdDevice.createNull();
      obd.on('myResponseReceived', (data) => { responseData = data; });

      obd.simulateResponseReceived('my_data');
      
      expect(responseData).toBe('my_data');
    });
  });

  describe('write', () => {
    test('should write to OBD device', () => {
      const obd = ObdDevice.createNull();

      obd.write('my_message');
      
      expect(obd.getLastWrite()).toBe('my_message');
    });
  });
});