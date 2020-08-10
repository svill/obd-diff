const ObdDataInput = require('./obdDataInput')

describe('ObdDataInput', () => {
  test('remembers last send state', () => {
    const obd = ObdDataInput.createNull(() => {})
    obd.input('my input')
    expect(obd.getLastInput()).toBe('my input')
  });

  test('should invoke callback function on data received', () => {
    let invoked = false;
    const obd = ObdDataInput.createNull(() => { invoked = true });
    obd.input('my input');
    expect(invoked).toBe(true);
  });
});
