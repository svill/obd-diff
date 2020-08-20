const Response = require('./response');

describe('Response', () => {
  const SINGLE_FRAME_RESPONSE = '2102,7E807610222374B38C9';
  const SINGLE_FRAME_RESPONSE_WITH_EMPTY = '2102,7E807610222374B38C9,,';
  const MULTI_FRAME_RESPONSE = '21E4,7E8100861E431000204,7E82164000000000000';

  test('should return value of response', () => {
    expect(Response(SINGLE_FRAME_RESPONSE).value).toBe(SINGLE_FRAME_RESPONSE);
  })

  describe('getId', () => {
    test('should empty Id when response is empty', () => {
      expect(Response('').getId()).toBe('');
    })

    test('should get Id as first frame', () => {
      expect(Response(SINGLE_FRAME_RESPONSE).getId()).toBe('2102');
    })

    test('should get Id as first frame', () => {
      expect(Response(MULTI_FRAME_RESPONSE).getId()).toBe('21E4');
    })
  });

  describe('count', () => {
    test('should return 0 when given empty', () => {
      expect(Response('').count()).toBe(0);
    })

    test('should count frames excluding the first', () => {
      expect(Response(SINGLE_FRAME_RESPONSE).count()).toBe(1);
    })
  
    test('should count frames excluding empty ones', () => {
      expect(Response(SINGLE_FRAME_RESPONSE_WITH_EMPTY).count()).toBe(1);
    })  

    test('should count frames excluding empty ones', () => {
      expect(Response(MULTI_FRAME_RESPONSE).count()).toBe(2);
    })
  });

  describe('getFrames', () => {
    test('should return empty array when given empty response', () => {
      expect(Response('').getFrames()).toEqual([]);
    })

    test('should return frames without the first ECHO frame', () => {
      expect(Response(SINGLE_FRAME_RESPONSE).getFrames()).toEqual(['7E807610222374B38C9']);
    })
  
    test('should return frames without empty ones', () => {
      expect(Response(SINGLE_FRAME_RESPONSE_WITH_EMPTY).getFrames()).toEqual(
        ['7E807610222374B38C9']);
    })

    test('should return consecutive frames when give a multiline reponse', () => {
      expect(Response(MULTI_FRAME_RESPONSE).getFrames()).toEqual(
        ['7E8100861E431000204', '7E82164000000000000']);
    })
  });

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

    test('should return with differing portions', () => {
      expect(Response('2102,7E807610222374B38C9').compare('2102,7E8076102AC374B42C9'))
        .toEqual([
          { value: '2102,7E8076102', diff: false },
          { value: 'AC', diff: true },
          { value: '374B', diff: false },
          { value: '42', diff: true },
          { value: 'C9', diff: false }
        ]);
    });
  });
});

