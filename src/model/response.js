const jsdiff = require('diff');

const Response = (response) => {
  const filteredFrames = response.split(',').filter(x => x.length)

  const getId = () => {
    return filteredFrames.length ? filteredFrames[0] : '';
  }

  const getFrames = () => {
    return filteredFrames.slice(1)
  }

  const count = () => {
    return getFrames().length;
  }

  const compare = (response2) => {
    const val = response2.getFrames().join()
    const diff = jsdiff.diffChars(response, val);
    return diff.filter(x => !!x.removed == false)
      .map(part => { return { 
          'value': part.value,
          'diff': !!part.added
        }
      });
  }

  const equals = (response2) => {
    return response == response2.value
  }

  return {
    getId,
    getFrames,
    count,
    compare,
    equals,
    value: response,
  }
}

module.exports = Response
