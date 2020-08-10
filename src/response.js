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

  return {
    compare,
  }
}

module.exports = Response
