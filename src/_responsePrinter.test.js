const CommandLine = require('./infrastructure/commandLine');
const ResponsePrinter = require('./responsePrinter');
const Frame = require('./frame');
const colors = require('colors');

describe('print', () => {  
  test('should not print anything when there is nothing to print', () => {
    const cli = CommandLine.createNull();
    const printer = new ResponsePrinter(cli);
    const response = Frame('').compare('');

    printer.print(response);

    expect(cli.getLastOutput()).toBe('');
  }); 

  test('should not print styling when there are no differences', () => {
    const cli = CommandLine.createNull();
    const printer = new ResponsePrinter(cli);
    const response = Frame('abc').compare('abc')

    printer.print(response);

    expect(cli.getLastOutput()).toBe('abc');
  });

  test('should print different text with red styling', () => {
    const cli = CommandLine.createNull();
    const printer = new ResponsePrinter(cli);
    const response = Frame('abcdefghi').compare('abc123ghi')

    printer.print(response);

    expect(cli.getLastOutput()).toBe('abc' + colors.red('123') + 'ghi');
  });
});
