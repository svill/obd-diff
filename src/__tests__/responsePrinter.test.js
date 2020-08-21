const CommandLine = require('../infrastructure/commandLine');
const ResponsePrinter = require('../responsePrinter');
const ResponseState = require('../responseState');
const Response = require('../model/response');
const colors = require('colors');

describe('print', () => {  
  test('should not print anything when there is nothing to print', () => {
    const printer = new ResponsePrinter();
    const response = Response('').compare('');

    const str = printer.print(response);

    expect(str).toBe('');
  }); 

  test('should not print styling when there are no differences', () => {
    const printer = new ResponsePrinter();
    const response = Response('abc').compare('abc')

    const str = printer.print(response);

    expect(str).toBe('abc');
  });

  test('should print different text with red styling', () => {
    const printer = new ResponsePrinter();
    const response = Response('abcdefghi').compare('abc123ghi')

    const str = printer.print(response);

    expect(str).toBe('abc' + colors.red('123') + 'ghi');
  });
});

describe('printTable', () => {
  test('should print table of responses when no differences', () => {
    const printer = new ResponsePrinter();
    const responseState = new ResponseState();
    responseState.update(Response('0105,ABCDEF'))
    responseState.update(Response('0106,123456'))

    const table = printer.printTable(responseState);

    expect(table).toBe(
      '0105 | ABCDEF\n' +
      '0106 | 123456\n'
    );
  });
});  
