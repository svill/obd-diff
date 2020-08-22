const ResponseState = require('../responseState');
const Response = require('../model/response');

describe('ResponseState', () => {
  test('should contain empty state when not given any response', () => {
    const responseState = new ResponseState();
    expect(responseState.getState()).toEqual(new Map());
  });

  describe('update', () => {
    const RESPONSE1 = 'pid1,frame1';
    const RESPONSE1_MODIFIED = 'pid1,frame1mod';    
    const RESPONSE2 = 'pid2,frame21'
 
    test('should add multiple responses', () => {
      const responseState = new ResponseState();
      const response1 = Response(RESPONSE1);
      const response2 = Response(RESPONSE2);

      responseState.update(response1);
      responseState.update(response2);

      expect(responseState.getState().size).toBe(2);
      expect(responseState.getState()).toEqual(new Map([
        [response1.getId(), [response1]],
        [response2.getId(), [response2]],
      ]));
    });
  
    test('should discard response if it is identical', () => {
      const responseState = new ResponseState();
      const response1 = Response(RESPONSE1);

      responseState.update(response1);
      responseState.update(response1);

      expect(responseState.getState().size).toBe(1);
      expect(responseState.getState()).toEqual(new Map([
        [response1.getId(), [response1]],
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
        [response1.getId(), [response1Modified, response1]],
      ]));      
    });

    test('should drop oldest history when max histories exceeded', () => {
      const responseState = new ResponseState();
      var responsesArr = []
      for (i = 0; i < responseState.maxHistories + 1; i++) {
        const response = Response('pid1,frame' + i)
        responseState.update(response);
        responsesArr.push(response);
      }
      responsesArr.reverse();
      responsesArr.pop()

      expect(responseState.getState().get('pid1').length).toBe(responseState.maxHistories);
      expect(responseState.getState().get('pid1')).toEqual(responsesArr);
    });
  });
})