const ResponseState = require('./responseState');
const Response = require('./model/response');

describe('ResponseState', () => {
  test('should contain empty state when not given any response', () => {
    const responseState = new ResponseState();
    expect(responseState.getState()).toEqual(new Map());
  });

  describe('update', () => {
    const RESPONSE1 = '2102,7E807610224334D35CE';
    const RESPONSE1_MODIFIED = '2102,7E807610224334D00FF';    
    const RESPONSE2 = '0140,7E906414000C800C8'
 
    test('should add multiple responses', () => {
      const responseState = new ResponseState();
      const response1 = Response(RESPONSE1);
      const response2 = Response(RESPONSE2);

      responseState.update(response1);
      responseState.update(response2);

      expect(responseState.getState().size).toBe(2);
      expect(responseState.getState()).toEqual(new Map([
        [response1.getId(), response1.getFrames()],
        [response2.getId(), response2.getFrames()],
      ]));
    });
  
    test('should discard response if it is identical', () => {
      const responseState = new ResponseState();
      const response1 = Response(RESPONSE1);

      responseState.update(response1);
      responseState.update(response1);

      expect(responseState.getState().size).toBe(1);
      expect(responseState.getState()).toEqual(new Map([
        [response1.getId(), response1.getFrames()],
      ]));
    });

    test('should store history of previous response if different', () => {
      const responseState = new ResponseState();
      const response1 = Response(RESPONSE1);
      const response1Modified = Response(RESPONSE1_MODIFIED);

      responseState.update(response1);
      responseState.update(response1Modified);

      expect(responseState.getState().size).toBe(1);
      expect(responseState.getState()).toEqual(new Map([
        ['2102', ['7E807610224334D00FF', '7E807610224334D35CE']],
      ]));      
    });
  });
})