require('./extension/mapExtensions');
const colors = require('colors');
const COL_DIVIDER = '|'
const MOST_RECENT_IDX = 1

module.exports = class ResponsePrinter {
  printTable(responseState) {
    return responseState.getState().reduce((acc, [key, values]) =>
      acc + `${key} ${COL_DIVIDER} ${this.printRow(values)}\n`)
  }

  printRow(histories) {
    const mostRecent = histories[0];
    if (histories.length == 1) {
      return mostRecent.value;
    }
    if (histories.length > 1) {
      const diffs = this._getDifferencesAndSort(mostRecent, histories)
      return this._addStyling(mostRecent, diffs);      
    }
  }

  _getDifferencesAndSort(mostRecent, histories) {
    const diffs = this.findDifferences(histories, mostRecent);
    return this._distinct(diffs).sort((a,b) => {return a.offset - b.offset})
  }

  findDifferences(histories, mostRecent) {
    const arrDiffs = [];
    histories.forEach((response, index) => {
      const parts = response.compare(mostRecent);
      let currentPos = 0;
      parts.forEach(part => {
        if (part.diff) {
          arrDiffs.push({ 
            offset: currentPos, 
            length: part.value.length,
            index 
          });
        }
        currentPos += part.value.length;
      });
    });
    return arrDiffs;
  }

  _distinct(arrDiffs) {
    return arrDiffs.filter((item, index, self) =>
      index === self.findIndex((t) => (
        t.offset === item.offset && 
        t.length === item.length
    )))
  }

  _addStyling(mostRecent, diffs) {
    let str = ""
    let currentPos = 0
    diffs.forEach(diff => {
      str = str + this.identicalSection(mostRecent, currentPos, diff, str);

      const differentSection = this.differentSection(mostRecent, currentPos, diff)
      const styleFunc = diff.index == MOST_RECENT_IDX ? this._primaryStyle : this._secondaryStyle
      str = str + styleFunc(differentSection)

      currentPos = diff.offset + diff.length
    });
    str = str + this.remaindingSection(mostRecent, currentPos)
    return str
  }

  identicalSection(mostRecent, currentPos, diff) {
    return mostRecent.value.substr(currentPos, diff.offset - currentPos);
  }

  differentSection(mostRecent, currentPos, diff) {
    return mostRecent.value.substr(currentPos > diff.offset ? currentPos : diff.offset, currentPos > diff.offset ? diff.length - (currentPos - diff.offset) : diff.length);
  }

  remaindingSection(mostRecent, currentPos) {
    return mostRecent.value.substr(currentPos);
  }

  _primaryStyle(text) {
    return colors.green(text)
  }

  _secondaryStyle(text) {
    return colors.blue(text)
  }
};
