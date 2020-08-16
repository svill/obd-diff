var jsdiff = require('diff');

const Response = (response) => {

  const getEcu = () => {    
    ecuRx = response.substr(2, 1);
    const ecuOrig = ecuRx - 8;
    return response.substr(0, 2).concat(ecuOrig);
  }

  const getMode = () => {    
    modeRx = response.substr(5, 2);
    const modeOrig = modeRx - 40;
    return modeOrig.toString().padStart(2, 0);
  }

  const getPid = () => {
    return response.substr(7, 2);
  }

  const getId = () => { return getEcu() + getMode() + getPid(); }

  const compare = (val) => {
    const diff = jsdiff.diffChars(response, val);
    return diff.filter(x => !!x.removed == false)
      .map(part => { return { 
          'value': part.value,
          'diff': !!part.added
        }
      });
  }

  return {
    compare,
    getEcu,
    getMode,
    getPid,
    getId,
    value: response,
  }
}

module.exports = Response
