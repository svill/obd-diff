const ResponsePrinter = require('../responsePrinter');
const ResponseState = require('../responseState');
const Response = require('../model/response');
const colors = require('colors');

describe('printTable', () => {
  test('should print table with plain text when there are no differences', () => {
    const printer = new ResponsePrinter();
    const responseState = new ResponseState();
    responseState.update(Response('pid1,frame11'))
    responseState.update(Response('pid2,frame21'))

    const table = printer.printTable(responseState);

    expect(table).toBe(
      'pid1 | frame11\n' +
      'pid2 | frame21\n'
    );
  });


  test('should print table with differences styled', () => {
    const printer = new ResponsePrinter();
    const responseState = new ResponseState();
    responseState.update(Response('pid1,frame11'))
    responseState.update(Response('pid2,frame21'))
    responseState.update(Response('pid2,frame2X'))

    const table = printer.printTable(responseState);

    expect(table).toBe(
      'pid1 | frame11\n' +
      'pid2 | frame2' + colors.blue('X') + '\n'
    );
  });

});

describe('print', () => {  
  test('should not print anything when the response is empty', () => {
    const printer = new ResponsePrinter();
    const responses = [Response('')]

    const str = printer.printRow(responses);

    expect(str).toBe('');
  });

  test('should print standalone response as is', () => {
    const printer = new ResponsePrinter();
    const responses = [Response('pid1,frame1')]

    const str = printer.printRow(responses);

    expect(str).toBe('frame1');
  });

  test('should print without styling when there are no differences', () => {
    const printer = new ResponsePrinter();
    const responses = [Response('pid1,frame1'), Response('pid1,frame1')]

    const str = printer.printRow(responses);

    expect(str).toBe('frame1');
  });

  test('should print styling when there are differences', () => {
    const printer = new ResponsePrinter();
    const responses = [Response('pid,abc123ghi'), Response('pid,abcdefghi')]

    const str = printer.printRow(responses);

    expect(str).toBe('abc' + colors.blue('123') + 'ghi');
  });

  test('should only print differences between two most recent responses', () => {
    const printer = new ResponsePrinter();
    const responses = [Response('pid,abc123ghi'), Response('pid,abcdefghi'), Response('pid,abcXYZghi')]

    const str = printer.printRow(responses);

    expect(str).toBe('abc' + colors.blue('123') + 'ghi');
  });
});
