const { Config } = require('../config');
const { FileSystem } = require('../../infrastructure/fileSystem')

describe('Config', () => {
  describe('getPids', () => {
    test('load PIDs from file', () => {
      const pidFile  = FileSystem.createNull("pid1\npid2\npid3")

      const config = new Config(pidFile)
      
      expect(config.getPids()).toEqual(['pid1', 'pid2', 'pid3'])
    })
  });
});
