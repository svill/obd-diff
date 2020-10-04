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
    if (histories.length == 1) {
      return mostRecent.value;
    }

    if (histories.length > 1) {
      const offsets = this._getHistoricOffsets(mostRecent, histories)
      const uniqueOffsets = this._distinctOffsets(offsets);
      
      const sortedOffsets = uniqueOffsets.sort((a,b) => {return a.offset - b.offset})
      // console.log(sortedOffsets)

      const styledStr = this._styledResponse(mostRecent, sortedOffsets);
      // console.log('ACTUAL:   ' + styledStr)

      return styledStr
    }    
  }

  _getHistoricOffsets(mostRecent, histories) {
    const arrayDiff = []
    histories.forEach((curResponse, index) => {
      const parts = curResponse.compare(mostRecent);
      let offset = 0
      parts.forEach(part => {
        if (part.diff) {
          const segment = { offset: offset, length: part.value.length, index }
          arrayDiff.push(segment)
        }
        offset += part.value.length
      })
    });
    return arrayDiff;
  }

  _styledResponse(mostRecent, uniqueOffsets) {
    let str = ""
    let currentPos = 0
    uniqueOffsets.forEach(element => {
      const similarPart = mostRecent.value.substr(currentPos, element.offset - currentPos)
      str = str + similarPart

      const styleFunc = element.index == 1 ? this._styleMostRecent : this._styleHistoric
      const diffPart = styleFunc(mostRecent.value.substr(currentPos > element.offset ? currentPos : element.offset, currentPos > element.offset ? element.length - (currentPos - element.offset) : element.length))
      str = str + diffPart

      currentPos = element.offset + element.length
    });
    str  = str + mostRecent.value.substr(currentPos)
    return str
  }

  _distinctOffsets(arrOffsets) {
    return arrOffsets.filter((item, index, self) =>
      index === self.findIndex((t) => (
        t.offset === item.offset && 
        t.length === item.length
    )))
  }

  _styleMostRecent(text) {
    return colors.green(text)
  }

  _styleHistoric(text) {
    return colors.blue(text)
  }
};
