const colors = require('colors');

module.exports = class ResponsePrinter {
  
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
    let table = ''
    map.forEach(function(value, key) {
      table += key + " | " + value[0].getFrames() + "\n";
    })
    return table;
  }
};
