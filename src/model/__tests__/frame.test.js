const Frame = require('../frame');

describe('Frame', () => {
  const FRAME1 = '7E807610224334D35CE';
  const FRAME2 = '7E906414000C800C8'

  test('get message from frame', () => {
    expect(Frame(FRAME1).value).toBe(FRAME1);
  })

  describe('getHeader', () => {
    test('should get ECU 7E0 when given header of 7E8', () => {
      expect(Frame(FRAME1).getEcu()).toBe('7E0');
    });
  
    test('should get ECU 7E1 when given header of 7E9', () => {
      expect(Frame(FRAME2).getEcu()).toBe('7E1');
    });
  });
  
  describe('getMode', () => {
    test('should get mode 21 from frame', () => {
      expect(Frame(FRAME1).getMode()).toBe('21');
    });
  
    test('should get mode 01 from frame', () => {
      expect(Frame(FRAME2).getMode()).toBe('01');
    });
  });
  
  describe('getPid', () => {
    test('should get PID 02 from frame', () => {
      expect(Frame(FRAME1).getPid()).toBe('02');
    });
  
    test('should get PID 40 from frame', () => {
      expect(Frame(FRAME2).getPid()).toBe('40');
    });
  });
  
  describe('getId', () => {
    test('should get Id from frame', () => {
      expect(Frame(FRAME1).getId()).toBe('7E02102');
    });
  
    test('should get Id from frame', () => {
      expect(Frame(FRAME2).getId()).toBe('7E10140');
    });
  });
});
