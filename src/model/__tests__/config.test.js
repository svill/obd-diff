const { Config } = require('../config');

describe('Config', () => {
  describe('getPids', () => {
    test('should return list of PIDs', () => {
      expect(new Config(['pid1', 'pid2']).getPids()).toEqual(['pid1', 'pid2']);
    })
  });
});

