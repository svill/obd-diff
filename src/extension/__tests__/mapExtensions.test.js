require('../mapExtensions')

describe('Map extensions', () => {

  describe('reduce', () => {
    const reducer = (acc, [key, value]) => acc + `${key}:${value},`

    test('should call reducer on empty Map', () => {
      const map = new Map()

      const result = map.reduce(reducer)

      expect(result).toBe('')
    })

    test('should call reducer on map with single item', () => {
      const map = new Map([
        ['key1', 'value1']
      ])

      const result = map.reduce(reducer)

      expect(result).toBe('key1:value1,')
    })

    test('should call reducer on map with multiple items', () => {
      const map = new Map([
        ['key1', 'value1'],
        ['key2', 'value2']
      ])

      const result = map.reduce(reducer)

      expect(result).toBe('key1:value1,key2:value2,')
    })

    test('should call reducer on map using initial value', () => {
      const map = new Map([
        ['key1', 'value1'],
        ['key2', 'value2'],
      ])

      const result = map.reduce(reducer, 'init_')

      expect(result).toBe('init_key1:value1,key2:value2,')
    })


    test('should call reducer on Map with number values', () => {
      const map = new Map([
        ['key1', 1],
        ['key2', 2]
      ])
      
      const result = map.reduce((acc, [key, value]) => acc + value, 0)

      expect(result).toBe(3)
    })
  })
})