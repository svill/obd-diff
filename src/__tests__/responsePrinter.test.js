const ResponsePrinter = require('../responsePrinter');
const { ResponseState } = require('../responseState');
const Response = require('../model/response');
const colors = require('colors');

describe('printTable', () => {
  test('should print table with plain text when there are no differences', () => {
    const printer = new ResponsePrinter();
    const responseState = new ResponseState();
    responseState.update(Response(['pid1','frame11']))
    responseState.update(Response(['pid2','frame21']))

    const table = printer.printTable(responseState);

    expect(table).toBe(
      'pid1 | frame11\n' +
      'pid2 | frame21\n'
    );
  });


  test('should print table with differences styled', () => {
    const printer = new ResponsePrinter();
    const responseState = new ResponseState();
    responseState.update(Response(['pid1','frame11']))
    responseState.update(Response(['pid2','frame21']))
    responseState.update(Response(['pid2','frame2X']))

    const table = printer.printTable(responseState);

    expect(table).toBe(
      'pid1 | frame11\n' +
      'pid2 | frame2' + colors.green('X') + '\n'
    );
  });

});

describe('printRow', () => {  
  test('should not print anything when the response is empty', () => {
    const printer = new ResponsePrinter();
    const responses = [Response([''])]

    const str = printer.printRow(responses);

    expect(str).toBe('');
  });

  test('should print standalone response as is', () => {
    const printer = new ResponsePrinter();
    const responses = [Response(['pid1','frame1'])]

    const str = printer.printRow(responses);

    expect(str).toBe('frame1');
  });

  test('should print without styling when there are no differences', () => {
    const printer = new ResponsePrinter();
    const responses = [Response(['pid1','frame1']), Response(['pid1','frame1'])]

    const str = printer.printRow(responses);

    expect(str).toBe('frame1');
  });

  describe('emphasize differences with alternate colours depending on position in history', () => {
    test('should emphasise with primary style when differences exist between the most recent response', () => {
      const printer = new ResponsePrinter();
      const responses = [
        Response(['pid','AABBXXDDEE']),
        Response(['pid','AABBCCDDEE'])]
  
      const str = printer.printRow(responses);
  
      expect(str).toBe(`AABB${'XX'.green}DDEE`);
    });
  
    test('should emphasise with secondary style when differences exist between historic responses', () => {
      const printer = new ResponsePrinter();
      const responses = [
        Response(['pid','AABBCCDDEE']),
        Response(['pid','AABBCCDDEE']),
        Response(['pid','AABBCCXXEE']),
        Response(['pid','AAZZCCXXEE']),
      ]
  
      const str = printer.printRow(responses);
  
      expect(str).toBe(`AA${'BB'.blue}CC${'DD'.blue}EE`);
    });
  
    test('should emphasise most recent differences with primary style and historic differences with secondary style', () => {
      const printer = new ResponsePrinter();
      const responses = [
        Response(['pid','YABBCCDDEE']),
        Response(['pid','AABBCCDDEE']),
        Response(['pid','AABBCCXXEE']),
        Response(['pid','AAZZCCXXEE']),
      ]
  
      const str = printer.printRow(responses);
  
      expect(str).toBe(`${'Y'.green}A${'BB'.blue}CC${'DD'.blue}EE`);
    });

    test('should favour emphasis of most recent difference over that of historic ones when there is an overlap', () => {
      const printer = new ResponsePrinter();
      const responses = [
        Response(['pid','AAYBCCDDEE']),
        Response(['pid','AABBCCDDEE']),
        Response(['pid','AABBCCXXEE']),
        Response(['pid','AAZZCCXXEE']),
      ]
  
      const str = printer.printRow(responses);
  
      expect(str).toBe(`AA${'Y'.green}${'B'.blue}CC${'DD'.blue}EE`);
    });
  });
});
