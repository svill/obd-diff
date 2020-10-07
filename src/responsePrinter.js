require('./extension/mapExtensions');
require('./extension/stringExtensions')
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
    
    const diffs = this._getDifferingSections(mostRecent, histories)
    return this._addStyling(mostRecent, diffs);
  }

  _getDifferingSections(mostRecent, histories) {
    const diffs = this.findDifferences(histories, mostRecent);
    return this._distinct(diffs).sort((a,b) => {return a.offset - b.offset})
  }

  findDifferences(histories, mostRecent) {
    const arrDiffs = [];
    histories.forEach((response, index) => {
      const parts = response.value.compare(mostRecent.value);
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
    let currentPos = 0
    const str = diffs.reduce((acc, diff) => {
      const _identicalSection =  this._identicalSection(mostRecent, currentPos, diff);
      const _styledSection = this._styledSection(mostRecent, currentPos, diff);
      currentPos = diff.offset + diff.length
      return acc + _identicalSection  + _styledSection
    }, '');
    return str + this.remainingSection(mostRecent, currentPos)
  }

  _identicalSection(mostRecent, currentPos, diff) {
    return mostRecent.value.substr(currentPos, diff.offset - currentPos);
  }

  _styledSection(mostRecent, currentPos, diff) {
    const _differentSection = this._differentSection(mostRecent, currentPos, diff);
    const styleFunc = diff.index == MOST_RECENT_IDX ? this._primaryStyle : this._secondaryStyle;
    return styleFunc(_differentSection);
  }

  _differentSection(mostRecent, currentPos, diff) {
    return mostRecent.value.substr(currentPos > diff.offset ? currentPos : diff.offset, currentPos > diff.offset ? diff.length - (currentPos - diff.offset) : diff.length);
  }

  remainingSection(mostRecent, currentPos) {
    return mostRecent.value.substr(currentPos);
  }

  _primaryStyle(text) {
    return colors.green(text)
  }

  _secondaryStyle(text) {
    return colors.blue(text)
  }
};
