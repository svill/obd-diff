const { 
  ObdDevice,
  OBD_DEVICE_CONNECTED, 
  OBD_DEVICE_RESPONSE_RECEIVED,
  OBD_DEVICE_WRITE_MSG,
} = require('../obdDevice')

describe('ObdDevice', () => {
  describe('connect', () => {
    test('should forward connected event when obd device connects', () => {
      const obd = ObdDevice.createNull();
      obd.on(OBD_DEVICE_CONNECTED, () => { eventTriggered = true; });

      obd.connect();
      
      expect(eventTriggered).toBe(true);
    });

    test('should connect with env var address and channel', () => {
      const obd = ObdDevice.createNull('my_address', 10);

      obd.connect();
      
      expect(obd.isConnected()).toBe(true);
      expect(obd.getAddress()).toBe('my_address');
      expect(obd.getChannel()).toBe(10);
    });
  });

  describe('responseReceived event', () => {
    test('should forward response received event when obd device receives data', () => {
      const obd = ObdDevice.createNull();
      obd.on(OBD_DEVICE_RESPONSE_RECEIVED, (data) => { responseData = data; });

      obd.simulateResponseReceived('my_data');
      
      expect(responseData).toBe('my_data');
    });
  });

  describe('write', () => {
    test('should write to OBD device', () => {
      const obd = ObdDevice.createNull();
      const sentMessages = trackSentMessages(obd)

      obd.write('my_message');
      
      expect(sentMessages).toContain('my_message');
    });

    test('should trigger event when message is written', () => {
      const obd = ObdDevice.createNull()
      const writes = [ 'ATX1', 'ATX2', 'ATX3', 'ATX4', 'ATX5' ]
      const sentMessages = trackSentMessages(obd)

      writes.map(x => { obd.write(x) })

      expect(sentMessages).toEqual(writes)
    });

    function trackSentMessages(obd) {
      const sentMessages = []
      obd.on(OBD_DEVICE_WRITE_MSG, (message) => {
        sentMessages.push(message)
      })
      return sentMessages;
    }
  });
});
