module.exports = class ResponseState {
  constructor() {
    this.state = new Map();
  }

  maxHistories = 10;

  update(response) {
    const id = response.getId();
    if (this.state.has(id)) {
      const histories = this.state.get(id);

      const previous = histories[0];
      if (!response.equals(previous)) {
        this._insertHistory(response, histories); 
      }
    } else {
      this._setHistory(response);
    }
  }
  
  _insertHistory(response, histories) {
    histories.unshift(response);
    if (histories.length > this.maxHistories) {
      histories.pop()
    }
    this.state.set(response.getId(), histories)
  }

  _setHistory(response) {
    this.state.set(response.getId(), [response])
  }

  getState() {
    return this.state;
  }
};
