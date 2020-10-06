class Config {
  constructor(pidFile) {
    this.pids = pidFile.readLines();
  }

  getPids() { return this.pids }
}

module.exports = { Config }
