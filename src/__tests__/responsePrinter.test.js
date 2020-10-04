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

describe('print', () => {  
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

  describe('emphasize differences with different colours depending on position in history', () => {
    test('should emphasise with green when differences exist between the most recent response', () => {
      const printer = new ResponsePrinter();
      const responses = [
        Response(['pid','AABBXXDDEE']),
        Response(['pid','AABBCCDDEE'])]
  
      const str = printer.printRow(responses);
  
      expect(str).toBe(`AABB${'XX'.green}DDEE`);
    });
  
    test('should emphasise with blue when differences exist between historic responses', () => {
      const printer = new ResponsePrinter();
      const responses = [
        Response(['pid','AABBCCDDEE']),
        Response(['pid','AABBCCDDEE']),
        Response(['pid','AABBCCXXEE'])]
  
      const str = printer.printRow(responses);
  
      expect(str).toBe(`AABBCC${'DD'.blue}EE`);
    });
  
    test('should emphasise with blue when differences exist between multiple historic responses', () => {
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
  
    test('should emphasise most recent differences with green and historic differences with blue', () => {
      const printer = new ResponsePrinter();
      const responses = [
        Response(['pid','1ABBCCDDEE']),
        Response(['pid','AABBCCDDEE']),
        Response(['pid','AABBCCXXEE']),
        Response(['pid','AAZZCCXXEE']),
      ]
  
      const str = printer.printRow(responses);
  
      expect(str).toBe(`${'1'.green}A${'BB'.blue}CC${'DD'.blue}EE`);
    });

    test('should emphasise with green when there is overlap between most recent and historic differences', () => {
      const printer = new ResponsePrinter();
      const responses = [
        Response(['pid','1A2BCCDDEE']),
        Response(['pid','AABBCCDDEE']),
        Response(['pid','AABBCCXXEE']),
        Response(['pid','AAZZCCXXEE']),
      ]
  
      const str = printer.printRow(responses);
      console.log('EXPECTED: ' + `${'1'.green}A${'2'.green}${'B'.blue}CC${'DD'.blue}EE`)
  
      expect(str).toBe(`${'1'.green}A${'2'.green}${'B'.blue}CC${'DD'.blue}EE`);
    });
  });
});
