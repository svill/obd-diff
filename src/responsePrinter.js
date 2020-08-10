const colors = require('colors');

module.exports = class ResponsePrinter {
  
  constructor(cli) {
    this._cli = cli
  };
  
  print(response) {
    const styledText = response.reduce((acc, part) => 
      acc + (part.diff ? this.addStyledText(part.value) : part.value), "");
    this._cli.output(styledText)
  }

  addStyledText(text) {
    return colors.red(text)
  }
};
