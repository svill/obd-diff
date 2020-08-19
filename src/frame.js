var jsdiff = require('diff');

const Frame = (frame) => {

  const getEcu = () => {    
    ecuRx = frame.substr(2, 1);
    const ecuOrig = ecuRx - 8;
    return frame.substr(0, 2).concat(ecuOrig);
  }

  const getMode = () => {    
    modeRx = frame.substr(5, 2);
    const modeOrig = modeRx - 40;
    return modeOrig.toString().padStart(2, 0);
  }

  const getPid = () => {
    return frame.substr(7, 2);
  }

  const getId = () => { return getEcu() + getMode() + getPid(); }

  const compare = (val) => {
    const diff = jsdiff.diffChars(frame, val);
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
    value: frame,
  }
}

module.exports = Frame
