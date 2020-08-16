const ResponseState = require('./responseState');
const Response = require('./response');

describe('ResponseState', () => {
  test('should contain empty state when not given any response', () => {
    const responseState = new ResponseState();
    expect(responseState.getState()).toEqual(new Map());
  });

  describe('update', () => {
    const RESPONSE1 = '7E807610224334D35CE';
    const RESPONSE2 = '7E906414000C800C8'

    test('should add response when given a response', () => {
      const responseState = new ResponseState();
      responseState.update(Response(RESPONSE1));
      expect(responseState.getState()).toEqual(new Map([
        ['7E02102', [RESPONSE1]]
      ]));
      expect(responseState.getState().size).toBe(1);
    });
  
    test('should update response when given existing response', () => {
      const responseState = new ResponseState();
      responseState.update(Response(RESPONSE1));
      responseState.update(Response(RESPONSE2));
      responseState.update(Response(RESPONSE1));
      expect(responseState.getState()).toEqual(new Map([
        ['7E02102', [RESPONSE1]],
        ['7E10140', [RESPONSE2]],
      ]));
      expect(responseState.getState().size).toBe(2);
    });
  });
})