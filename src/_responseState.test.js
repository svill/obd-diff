const ResponseState = require('./responseState');
const Frame = require('./model/frame');

describe('ResponseState', () => {
  test('should contain empty state when not given any response', () => {
    const responseState = new ResponseState();
    expect(responseState.getState()).toEqual(new Map());
  });

  describe('update', () => {
    const FRAME1 = '7E807610224334D35CE';
    const FRAME2 = '7E906414000C800C8'
    const FRAME1_MODIFIED = '7E807610224334D00FF';

    test('should add response when given a response', () => {
      const responseState = new ResponseState();

      responseState.update(Frame(FRAME1));

      expect(responseState.getState().size).toBe(1);
      expect(responseState.getState()).toEqual(new Map([
        ['7E02102', [FRAME1]]
      ]));
    });
  
    test('should discard response if it is the same', () => {
      const responseState = new ResponseState();

      responseState.update(Frame(FRAME1));
      responseState.update(Frame(FRAME2));
      responseState.update(Frame(FRAME1));

      expect(responseState.getState().size).toBe(2);
      expect(responseState.getState()).toEqual(new Map([
        ['7E02102', [FRAME1]],
        ['7E10140', [FRAME2]],
      ]));
    });

    test('should store history of previous response if different', () => {
      const responseState = new ResponseState();

      responseState.update(Frame(FRAME1));
      responseState.update(Frame(FRAME2));
      responseState.update(Frame(FRAME1_MODIFIED));

      expect(responseState.getState().size).toBe(2);
      expect(responseState.getState()).toEqual(new Map([
        ['7E02102', [FRAME1_MODIFIED, FRAME1]],
        ['7E10140', [FRAME2]],
      ]));      
    });
  });
})