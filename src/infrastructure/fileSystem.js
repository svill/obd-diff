const fs = require('fs')

class FileSystem {
  static createNull(contents) {
    return new FileSystem(new NullFileSystem(contents), 'null_file')
  }

  static create(filePath) {
    return new FileSystem(fs, filePath)
  }

  constructor(fs, filePath) {
    this._fs = fs
    this._filePath = filePath
  }

  readLines() {
    const contents = this._fs.readFileSync(this._filePath, { encoding: 'utf8' })
    return contents.split('\n')
  }
}

class NullFileSystem {
  constructor(contents) {
    this.contents = contents
  }

  readFileSync(filePath, options) {
    return this.contents;
  }
}

module.exports = {
  FileSystem
}
