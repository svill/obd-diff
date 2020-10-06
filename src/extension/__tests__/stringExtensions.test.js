require('../stringExtensions')

describe('String extensions', () => {
  
  describe('compare', () => {
    test('should return empty when comparing empty values', () => {
      expect(''.compare(''))
        .toEqual([
          { value: '', diff: false }
        ]);
    });
  
    test('should return single identical char', () => {
      expect('f'.compare('f'))
        .toEqual([
          { value: 'f', diff: false }
        ]);
    });
  
    test('should return single identical string', () => {
      expect('frame'.compare('frame'))
        .toEqual([
          { value: 'frame', diff: false } 
        ]);
    });
  
    test('should return with differing char', () => {
      expect('frame'.compare('frXme'))
        .toEqual([
          { value: 'fr', diff: false },
          { value: 'X', diff: true },
          { value: 'me', diff: false }
        ]);
    });

    test('should return with differing portions', () => {
      const str1 = 'frame0frame0frame0frame0'
      const str2 = 'framAAframBBframe0frame0'
      expect(str1.compare(str2))
        .toEqual([
          { value: 'fram', diff: false },
          { value: 'AA', diff: true },
          { value: 'fram', diff: false },
          { value: 'BB', diff: true },
          { value: 'frame0frame0', diff: false }
        ]);
    });
  });
})