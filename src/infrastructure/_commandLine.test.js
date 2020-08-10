"use strict"

const CommandLine = require('./commandLine');

describe('output', () => {
  test('remembers last console out', () => {
    const commandLine = CommandLine.createNull()
    commandLine.output('my output');
    expect(commandLine.getLastOutput()).toBe('my output');
  });
});