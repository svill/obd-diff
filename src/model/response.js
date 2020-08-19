const Response = (response) => {
  const filteredFrames = response.split(',').filter(x => x.length)

  const getId = () => {
    return filteredFrames.shift();
  }

  const getFrames = () => {
    return filteredFrames.slice(1)
  }

  const count = () => {
    return getFrames().length;
  }

  return {
    getId,
    getFrames,
    count,
    value: response,
  }
}

module.exports = Response
