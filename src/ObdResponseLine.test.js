const ObdResponseLine = require('./ObdResponseLine');

describe('compare', () => {
  test('should return empty when comparing empty values', () => {
    expect(ObdResponseLine('').compare(''))
      .toEqual([
        { value: '', diff: false }
      ]);
  });

  test('should return single identical char', () => {
    expect(ObdResponseLine('a').compare('a'))
      .toEqual([
        { value: 'a', diff: false }
      ]);
  });

  test('should return single identical string', () => {
    expect(ObdResponseLine('abc').compare('abc'))
      .toEqual([
        { value: 'abc', diff: false } 
      ]);
  });

  test('should return with differing char', () => {
    expect(ObdResponseLine('abc').compare('azc'))
      .toEqual([
        { value: 'a', diff: false },
        { value: 'z', diff: true },
        { value: 'c', diff: false }
      ]);
  });
});
