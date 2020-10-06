const FIRST_ARG_POS = 2 

module.exports = class CommandLine {
  static createNull(args) {
    return new CommandLine(new NullConsole(), new NullProcess(args));
  }

  static create() {
    return new CommandLine(console, process);
  }
  
  constructor(cli, process) {
    this._cli = cli;
    this._process = process;
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

  args() { return this._process.argv.slice(FIRST_ARG_POS) }
};

class NullConsole {
  log() {}
  clear() {}
}

class NullProcess {
  constructor(args) {
    this._args = args 
  }
  
  get argv() { return [undefined, undefined, ...this._args] }
}
