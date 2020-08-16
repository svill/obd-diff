module.exports = class ResponseState {
  constructor() {
    this.state = new Map();
  }

  update(response) {
    this.state.set(response.getId(), [response.value])
  }

  getState() {
    return this.state;
  }
};
