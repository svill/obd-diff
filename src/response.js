var jsdiff = require('diff');

const Response = (response) => {
  
  const compare = (val) => {
    const diff = jsdiff.diffChars(response, val);
    return diff.filter(x => !!x.removed == false)
      .map(part => { return { 
          'value': part.value,
          'diff': !!part.added
        }
      });
  }

  const getPid = () => {
    const modeRx = response.substr(7, 2);
    const pidRx = response.substr(9, 2);
    const modeOrig = modeRx - 40;
    return modeOrig + pidRx;
  }

  return {
    compare,
    getPid,
  }
}

module.exports = Response
