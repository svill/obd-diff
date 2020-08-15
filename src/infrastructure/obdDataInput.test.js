const ObdDataInput = require('./obdDataInput')

describe('ObdDataInput', () => {
  describe('connect', () => {
    test('should forward connected event when obd device connects', () => {
      const obd = ObdDataInput.createNull();
      obd.on('myConnected', () => {
        triggeredConnected = true;
      });

      obd.simulateConnect();
      
      expect(triggeredConnected).toBe(true);
      expect(obd.isConnected()).toBe(true);
    });
  });
});
