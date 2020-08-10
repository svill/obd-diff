module.exports = class CommandLine {
  static createNull() {
    return new CommandLine(new NoOpConsole());
  }

  static create() {
    return new CommandLine(console);
  }
  
  constructor(cli) {
    this._cli = cli;
  }

  output(text) {
    this._cli.log(text);
    this._lastOutput = text;
  }

  getLastOutput() {
    return this._lastOutput;
  }
};

class NoOpConsole {
  log() {}
}