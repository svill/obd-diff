const colors = require('colors');

module.exports = class ResponsePrinter {
  printTable(responseState) {
    const map = responseState.getState();
    let table = ''
    map.forEach(function(value, key) {
      table += key + " | " + value[0].getFrames() + "\n";
    })
    return table;
  }

  printRow(responses) {
    const primary = responses[0];
    const secondary = responses[1];

    if (secondary) {
      const diff = primary.compare(secondary);
      const styledText = this.print(diff)
      return styledText
    }
    return primary.getFrames().join();
  }

  print(diff) {
    const styledText = diff.reduce((acc, part) => 
      acc + (part.diff ? this.addStyledText(part.value) : part.value), "");
    return styledText
  }

  addStyledText(text) {
    return colors.red(text)
  }

};
