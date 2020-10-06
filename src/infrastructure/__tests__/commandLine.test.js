"use strict"

const CommandLine = require('../commandLine');
describe('CommandLine', () => {
  describe('output', () => {
    test('remembers last console out', () => {
      const commandLine = CommandLine.createNull()
      commandLine.output('my output');
      expect(commandLine.getLastOutput()).toBe('my output');
    });
  });
  
  describe('clear', () => {
    test('should clear console', () => {
      const commandLine = CommandLine.createNull()
      commandLine.clear();
      expect(commandLine.getClearedCount()).toBe(1);
    })
  })

  describe('argv', () => {
    test('argument is nullable', () => {
      const commandLine = CommandLine.createNull(['null_arg'])
      expect(commandLine.args()).toEqual(['null_arg'])
    })

    test('arguments are nullable', () => {
      const commandLine = CommandLine.createNull(['null_arg1', 'null_arg2'])
      expect(commandLine.args()).toEqual(['null_arg1', 'null_arg2'])
    })

    test('provides real command-line arguments', () => {
      const oldArgs = process.argv
      try {
        process.argv = ['node', 'filename.js', 'my_arg1', 'my_arg2']
        const commandLine = CommandLine.create()
        expect(commandLine.args()).toEqual(['my_arg1', 'my_arg2'])
      }
      finally {
        process.argv = oldArgs
      }
    })
  })
})
