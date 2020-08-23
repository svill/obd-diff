require('./extension/mapExtensions');
const colors = require('colors');
const COL_DIVIDER = '|'

module.exports = class ResponsePrinter {
  printTable(responseState) {
    return responseState.getState().reduce((acc, [key, values]) =>
      acc + `${key} ${COL_DIVIDER} ${this.printRow(values)}\n`)
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
