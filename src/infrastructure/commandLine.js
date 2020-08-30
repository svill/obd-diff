module.exports = class CommandLine {
  static createNull() {
    return new CommandLine(new NullConsole());
  }

  static create() {
    return new CommandLine(console);
  }
  
  constructor(cli) {
    this._cli = cli;
    this._clearedCount = 0
  }

  output(text) {
    this._cli.log(text);
    this._lastOutput = text;
  }

  getLastOutput() {
    return this._lastOutput;
  }

  clear() {
    this._cli.clear()
    this._clearedCount++
  }

  getClearedCount() { return this._clearedCount }
};

class NullConsole {
  log() {}
  clear() {}
}