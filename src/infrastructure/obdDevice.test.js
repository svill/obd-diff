const ObdDevice = require('./obdDevice')

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

  describe('message received', () => {
    test('should forward message received event when obd device receives data', () => {
      const obd = ObdDevice.createNull();
      obd.on('myMessageReceived', (data) => { messageData = data; });

      obd.simulateMessageReceived('my_data');
      
      expect(messageData).toBe('my_data');
    });
  });
});
