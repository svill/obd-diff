"use strict"
const colors = require('colors');

module.exports = class ResponsePrinter {
  
  constructor(cons) {
    this._console = cons
  }

  static create() {
    return new ResponsePrinter(console);
  };

  static createNull() {
    return new ResponsePrinter(new NullConsole());
  };

  print(obdResponse) {
    const styledText = obdResponse.reduce((acc, part) => 
      acc + (part.diff ? this.addStyledText(part.value) : part.value), "");
    if (styledText) this.output(styledText)
  }

  addStyledText(text) {
    return colors.red(text)
  }

  output(data) {
    this._console.log(data);
    this._lastOutput = data;
  }

  getLastOutput() {
    return this._lastOutput;
  }
};

class NullConsole {
  log() {}
}