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
})
