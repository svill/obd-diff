const colors = require('colors');
const COL_DIVIDER = ' | '

module.exports = class ResponsePrinter {
  printTable(responseState) {
    const map = responseState.getState();
    let table = ''
    const self = this;   
    map.forEach(function(histories, key) {
      table += key + COL_DIVIDER + self.printRow(histories) + "\n";
    })
    return table;
  }

  printRow(histories) {
    const mostRecent = histories[0];
    
    if (histories.length > 1) {
      const previous = histories[1];
      const diff = previous.compare(mostRecent);
      return this._styleDiff(diff)
    }
    return mostRecent.value;
  }

  _styleDiff(diff) {
    return diff.reduce((accumulator, part) => 
      accumulator + (part.diff ? this._styleText(part.value) : part.value), '');
  }

  _styleText(text) {
    return colors.blue(text)
  }
};
