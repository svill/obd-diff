module.exports = class ResponseState {
  constructor() {
    this.state = new Map();
  }

  update(response) {
    const id = response.getId();
    if (this.state.has(id)) {
      const histories = this.state.get(id);

      const previous = histories[0];
      if (!this._isResponseEqual(response, previous)) {
        this._insertHistory(response, histories); 
      }
    } else {
      this._setHistory(response);
    }
  }

  _isResponseEqual(response, previous) {
     return response.compare(previous).length == 1
  }

  _insertHistory(response, histories) {
    console.log(response.getFrames())
    histories.unshift(...response.getFrames());
    this.state.set(response.getId(), histories)
  }

  _setHistory(response) {
    this.state.set(response.getId(), response.getFrames())
  }

  getState() {
    return this.state;
  }
};
