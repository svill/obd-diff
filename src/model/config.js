class Config {
  constructor(pids) {
    this.pids = pids;
  }

  getPids() { return this.pids }
}

module.exports = {
  Config
}
