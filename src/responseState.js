const MAX_RESPONSE_HISTORY = 10;

class ResponseState {
  constructor() {
    this.state = new Map();
  }

  update(response) {
    const id = response.getId();
    const history = this.state.has(id) ? this.state.get(id) : this._initHistory(response)

    const previous = history[0];
    if (previous && !response.equals(previous)) {
      this._addHistory(response, history);
    }
  }

  _initHistory(response) {
    return this.state.set(response.getId(), [response])
  }
  
  _addHistory(response, history) {
    history.unshift(response);
    this._removeExcessHistories(history);
  }

  _removeExcessHistories(history) {
    if (history.length > MAX_RESPONSE_HISTORY) {
      history.pop()
    }
  }

  getState() {
    return this.state;
  }
}

module.exports = {
  MAX_RESPONSE_HISTORY,
  ResponseState
}
