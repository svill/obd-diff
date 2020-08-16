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

describe('getPid', () => {
  test('should get PID from response with headers ON', () => {
    expect(Response('7E9100C610200000000').getPid()).toBe('2102');
  });
});
