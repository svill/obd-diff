const ResponsePrinter = require('../responsePrinter');
const ResponseState = require('../responseState');
const Response = require('../model/response');
const colors = require('colors');

describe('printTable', () => {
  test('should print table of responses when no differences', () => {
    const printer = new ResponsePrinter();
    const responseState = new ResponseState();
    responseState.update(Response('pid1,ABCDEF'))
    responseState.update(Response('pid2,123456'))

    const table = printer.printTable(responseState);

    expect(table).toBe(
      'pid1 | ABCDEF\n' +
      'pid2 | 123456\n'
    );
  });
});

describe('print', () => {  

  // TODO: response print should take in array of Response
  test('should not print anything when there is nothing to print', () => {
    const printer = new ResponsePrinter();
    const responses = [Response(''), Response('')]

    const str = printer.printRow(responses);

    expect(str).toBe('');
  });

  test('should print only response as is', () => {
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
    const responses = [Response('pid,abcdefghi'), Response('pid,abc123ghi')]

    const str = printer.printRow(responses);

    expect(str).toBe('abc' + colors.red('123') + 'ghi');
  });
});
