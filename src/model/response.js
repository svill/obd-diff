const jsdiff = require('diff');

const Response = (responseString) => {
  const filteredFrames = responseString.filter(x => x.length)

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
    return responseString.join(',');
  }

  return {
    getId,
    getFrames,
    equals,
    toString,
    value: getFrames().join(),
  }
}

module.exports = Response
