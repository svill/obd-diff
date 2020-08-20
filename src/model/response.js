const jsdiff = require('diff');

const Response = (response) => {
  const filteredFrames = response.split(',').filter(x => x.length)

  const getId = () => {
    return filteredFrames[0];
  }

  const getFrames = () => {
    return filteredFrames.slice(1)
  }

  const count = () => {
    return getFrames().length;
  }

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
    getId,
    getFrames,
    count,
    compare,
    value: response,
  }
}

module.exports = Response