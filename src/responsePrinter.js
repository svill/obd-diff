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
    const mostRecent = responses[0];
    if (responses.length > 1) {
      const previous = responses[1];
      const diff = mostRecent.compare(previous);
      return this._styleDiff(diff)
    }
    return mostRecent.getFrames().join();
  }

  _styleDiff(diff) {
    const styledText = diff.reduce((acc, part) => 
      acc + (part.diff ? this._styleText(part.value) : part.value), "");
    return styledText
  }

  _styleText(text) {
    return colors.red(text)
  }
};
