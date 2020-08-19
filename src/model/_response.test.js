const Response = require('./response');

describe('Response', () => {
  const SINGLE_FRAME_RESPONSE = '2102,7E807610222374B38C9';
  const SINGLE_FRAME_RESPONSE_WITH_EMPTY = '2102,7E807610222374B38C9,,';
  const MULTI_FRAME_RESPONSE = '21E4,7E8100861E431000204,7E82164000000000000';

  test('should return value of response', () => {
    expect(Response(SINGLE_FRAME_RESPONSE).value).toBe(SINGLE_FRAME_RESPONSE);
  })

  describe('getId', () => {
    test('should get Id as first frame', () => {
      expect(Response(SINGLE_FRAME_RESPONSE).getId()).toBe('2102');
    })

    test('should get Id as first frame', () => {
      expect(Response(MULTI_FRAME_RESPONSE).getId()).toBe('21E4');
    })
  });

  describe('count', () => {
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
});

