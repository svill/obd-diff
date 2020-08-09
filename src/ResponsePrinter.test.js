const ResponsePrinter = require('./ResponsePrinter');
const ObdResponseLine = require('./ObdResponseLine');
const colors = require('colors');

describe('output', () => {
  test('remembers last console out', () => {
    const printer = ResponsePrinter.createNull()
    printer.output("my output");
    expect(printer.getLastOutput()).toBe("my output");
  });
});

describe('print raw', () => {
  test('should not print anything when there is nothing to print', () => {
    const printer = ResponsePrinter.createNull()
    printer.print([]);
    expect(printer.getLastOutput()).toBeUndefined();
  }); 

  test('should not print styling when there are no differences', () => {
    const printer = ResponsePrinter.createNull()
    printer.print([ { value:'abc', diff: false } ] );
    expect(printer.getLastOutput()).toBe("abc");
  });

  test('should print red styling when there is a difference', () => {
    const printer = ResponsePrinter.createNull()
    printer.print([ 
      { value:'abc', diff: false },
      { value:'def', diff: true },
      { value:'ghi', diff: false },
    ]);
    expect(printer.getLastOutput()).toBe("abc" + colors.red("def") + "ghi");
  });
});

describe('print ObdResponseLine', () => {
  test('should print red styling when there is a difference 2', () => {
    const printer = ResponsePrinter.createNull()
    printer.print(ObdResponseLine('abcdefghi').compare('abczzzghi'));
    expect(printer.getLastOutput()).toBe("abc" + colors.red("zzz") + "ghi");
  });
});
