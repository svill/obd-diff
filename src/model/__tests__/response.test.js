const Response = require('../response');

describe('Response', () => {
  const SINGLE_FRAME_RESPONSE = 'pid1,frame1';
  const SINGLE_FRAME_RESPONSE_WITH_EMPTY = 'pid1,frame1,,';
  const MULTI_FRAME_RESPONSE = 'pid2,frame1,frame2';

  describe('getId', () => {
    test('should empty Id when response is empty', () => {
      expect(Response('').getId()).toBe('');
    })

    test('should get Id as first frame', () => {
      expect(Response(SINGLE_FRAME_RESPONSE).getId()).toBe('pid1');
    })

    test('should get Id as first frame', () => {
      expect(Response(MULTI_FRAME_RESPONSE).getId()).toBe('pid2');
    })
  });

  describe('toString', () => {
    test('should return empty when given empty response', () => {
      expect(Response('').toString()).toEqual('');
    })

    test('should return response when given response', () => {
      expect(Response(SINGLE_FRAME_RESPONSE).toString()).toEqual(SINGLE_FRAME_RESPONSE);
    })

    test('should return response when given multi-frame response', () => {
      expect(Response(MULTI_FRAME_RESPONSE).toString()).toEqual(MULTI_FRAME_RESPONSE);
    })
  });

  describe('getFrames', () => {
    test('should return empty array when given empty response', () => {
      expect(Response('').getFrames()).toEqual([]);
    })

    test('should return frames without the first ECHO frame', () => {
      expect(Response(SINGLE_FRAME_RESPONSE).getFrames()).toEqual(['frame1']);
    })
  
    test('should return frames without empty ones', () => {
      expect(Response(SINGLE_FRAME_RESPONSE_WITH_EMPTY).getFrames()).toEqual(
        ['frame1']);
    })

    test('should return consecutive frames when give a multiline reponse', () => {
      expect(Response(MULTI_FRAME_RESPONSE).getFrames()).toEqual(
        ['frame1', 'frame2']);
    })
  });

  describe('value', () => {
    test('should return empty when given empty response', () => {
      expect(Response('').value).toBe('');
    })

    test('should return frames without the first ECHO frame', () => {
      expect(Response(SINGLE_FRAME_RESPONSE).value).toBe('frame1');
    })
  
    test('should return frames without empty ones', () => {
      expect(Response(SINGLE_FRAME_RESPONSE_WITH_EMPTY).value).toBe('frame1');
    })

    test('should return consecutive frames when give a multiline reponse', () => {
      expect(Response(MULTI_FRAME_RESPONSE).value).toBe('frame1,frame2');
    })
  });

  describe('equals', () => {
    test('should be true when empty', () => {
      expect(Response('').equals(Response(''))).toBeTruthy();
    })

    test('should be true when single frame response', () => {
      expect(Response('pid,frame').equals(Response('pid,frame'))).toBeTruthy();
    })

    test('should be true when multiframe response', () => {
      expect(Response('pid,frame1,frame2').equals(Response('pid,frame1,frame2'))).toBeTruthy();
    })

    test('should be false when frame is different response', () => {
      expect(Response('pid,frame').equals(Response('pid,frameX'))).toBeFalsy();
    })

    test('should be false when pid is different response', () => {
      expect(Response('pidX,frame').equals(Response('pid,frame'))).toBeFalsy();
    })

    // test('should be true when pid and frames are the same ignoring empty ones', () => {}
  });

  describe('compare', () => {
    test('should return empty when comparing empty values', () => {
      const emptyResponse = Response('')
      expect(emptyResponse.compare(emptyResponse))
        .toEqual([
          { value: '', diff: false }
        ]);
    });
  
    test('should return single identical char', () => {
      const response = Response('pid,f')
      expect(response.compare(response))
        .toEqual([
          { value: 'f', diff: false }
        ]);
    });
  
    test('should return single identical string', () => {
      const response = Response('pid,frame')
      expect(response.compare(response))
        .toEqual([
          { value: 'frame', diff: false } 
        ]);
    });
  
    test('should return with differing char', () => {
      const response1 = Response('pid,frame')
      const response2 = Response('pid,frXme')
      expect(response1.compare(response2))
        .toEqual([
          { value: 'fr', diff: false },
          { value: 'X', diff: true },
          { value: 'me', diff: false }
        ]);
    });

    test('should return with differing portions', () => {
      const response1 = Response('pid,frame0frame0frame0frame0')
      const response2 = Response('pid,framAAframBBframe0frame0')
      expect(response1.compare(response2))
        .toEqual([
          { value: 'fram', diff: false },
          { value: 'AA', diff: true },
          { value: 'fram', diff: false },
          { value: 'BB', diff: true },
          { value: 'frame0frame0', diff: false }
        ]);
    });
  });
});

