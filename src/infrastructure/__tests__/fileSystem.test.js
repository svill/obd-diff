const { FileSystem } = require('../fileSystem') 
const fs = require('fs')

describe('FileSystem', () => {
  describe('readLines', () => {
    test('should return string array when given single-line of nullable content', () => {
      const fileSystem = FileSystem.createNull('my_line')
      expect(fileSystem.readLines()).toEqual(['my_line'])
    })
  
    test('should return string array when given multi-line of nullable content', () => {
      const fileSystem = FileSystem.createNull('my_line1\nmy_line2')
      expect(fileSystem.readLines()).toEqual(['my_line1', 'my_line2'])
    })
  
    test('should provide real file contents as string array', () => {
      const fileSystem = FileSystem.create(__dirname + '/test_file.txt')
      expect(fileSystem.readLines()).toEqual(['Line1', 'Line2', 'Line3'])
    })
  })
})
