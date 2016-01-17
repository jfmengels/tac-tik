import expect from 'expect'
import { stringifyLocation } from './'

describe('utils', () => {
  describe('stringifyLocation', () => {
    let location

    beforeEach(() => {
      location = {
        pathname: '/some/path',
        search: '',
        hash: '',
        state: {
          a: '2',
          b: '3'
        },
        action: 'POP',
        key: null
      }
    })

    it('should return path', () => {
      const result = stringifyLocation(location)
      expect(result).toEqual('/some/path?a=2&b=3')
    })
  })
})
