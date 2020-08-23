const jsdiff = require('diff');

const Response = (responseString) => {
  const filteredFrames = responseString.split(',').filter(x => x.length)

  const getId = () => {
    return filteredFrames.length ? filteredFrames[0] : '';
  }

  const getFrames = () => {
    return filteredFrames.slice(1)
  }

  const equals = (response2) => {
    return responseString.toString() == response2.toString()
  }

  const toString = () => {
    return responseString;
  }

  const compare = (response2) => {
    const diff = jsdiff.diffChars(responseString, response2.value);
    return diff.filter(x => !!x.removed == false)
      .map(part => { return { 
          'value': part.value,
          'diff': !!part.added
        }
      });
  }

  return {
    getId,
    compare,
    getFrames,
    equals,
    toString,
    value: getFrames().join(),
  }
}

module.exports = Response
