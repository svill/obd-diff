const ResponsePrinter = require('./responsePrinter');
const Response = require('./response');
const colors = require('colors');

describe('output', () => {
  test('remembers last console out', () => {
    const printer = ResponsePrinter.createNull()
    printer.output("my output");
    expect(printer.getLastOutput()).toBe("my output");
  });
});

describe('print', () => {
  test('should not print anything when there is nothing to print', () => {
    const printer = ResponsePrinter.createNull()
    printer.print(Response('').compare(''));
    expect(printer.getLastOutput()).toBe('');
  }); 

  test('should not print styling when there are no differences', () => {
    const printer = ResponsePrinter.createNull()
    printer.print(Response('abc').compare('abc'));
    expect(printer.getLastOutput()).toBe("abc");
  });

  test('should print different text with red styling', () => {
    const printer = ResponsePrinter.createNull()
    printer.print(Response('abcdefghi').compare('abc123ghi'));
    expect(printer.getLastOutput()).toBe("abc" + colors.red("123") + "ghi");
  });
});
