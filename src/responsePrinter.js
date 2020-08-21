const colors = require('colors');

module.exports = class ResponsePrinter {
  
  constructor(cli) {
    this._cli = cli
  };
  
  print(response) {
    const styledText = response.reduce((acc, part) => 
      acc + (part.diff ? this.addStyledText(part.value) : part.value), "");
    return styledText
  }

  addStyledText(text) {
    return colors.red(text)
  }

  printTable(responseState) {
    const map = responseState.getState();
    let str = ''
    map.forEach(function(value, key) {
      str += key + " | " + value[0].getFrames() + "\n";
    })
    this._cli.output(str);
  }
};
