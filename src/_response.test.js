const Response = require('./response');

describe('compare', () => {
  test('should return empty when comparing empty values', () => {
    expect(Response('').compare(''))
      .toEqual([
        { value: '', diff: false }
      ]);
  });

  test('should return single identical char', () => {
    expect(Response('a').compare('a'))
      .toEqual([
        { value: 'a', diff: false }
      ]);
  });

  test('should return single identical string', () => {
    expect(Response('abc').compare('abc'))
      .toEqual([
        { value: 'abc', diff: false } 
      ]);
  });

  test('should return with differing char', () => {
    expect(Response('abc').compare('azc'))
      .toEqual([
        { value: 'a', diff: false },
        { value: 'z', diff: true },
        { value: 'c', diff: false }
      ]);
  });
});

describe('Response', () => {
  const RESPONSE1 = '7E807610224334D35CE';
  const RESPONSE2 = '7E906414000C800C8'

  describe('getHeader', () => {
    test('should get ecu 0 when given header of 7E8', () => {
      expect(Response(RESPONSE1).getEcu()).toBe('7E0');
    });
  
    test('should get ecu 1 when given header of 7E9', () => {
      expect(Response(RESPONSE2).getEcu()).toBe('7E1');
    });
  });
  
  describe('getMode', () => {
    test('should get mode 21 from response', () => {
      expect(Response(RESPONSE1).getMode()).toBe('21');
    });
  
    test('should get mode 01 from response', () => {
      expect(Response(RESPONSE2).getMode()).toBe('01');
    });
  });
  
  describe('getPid', () => {
    test('should get PID 02 from response', () => {
      expect(Response(RESPONSE1).getPid()).toBe('02');
    });
  
    test('should get PID 40 from response', () => {
      expect(Response(RESPONSE2).getPid()).toBe('40');
    });
  });
  
  describe('getId', () => {
    test('should get Id from response', () => {
      expect(Response(RESPONSE1).getId()).toBe('7E02102');
    });
  
    test('should get Id from response', () => {
      expect(Response(RESPONSE2).getId()).toBe('7E10140');
    });
  });

});