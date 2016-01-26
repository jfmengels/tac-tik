import _ from 'lodash/fp'
import expect from 'expect'

import { isAtPos, update, flowSkipOnError, applyIf, setErrorIf } from './fp-utils'

describe('fp-utils', () => {
  describe('isAtPos', () => {
    const toPiece = (pos, isHome) => ({pos, isHome})

    it('should return true if piece is at the given position and not at destination', () => {
      const position = 12
      const piece = toPiece(12, false)

      const actual = isAtPos(position, piece)

      expect(actual).toEqual(true)
    })

    it('should return false if piece is not at the given position and not at destination', () => {
      const position = 12
      const piece = toPiece(11, false)

      const actual = isAtPos(position, piece)

      expect(actual).toEqual(false)
    })

    it('should return false if piece is at the given position but at destination', () => {
      const position = 2
      const piece = toPiece(2, true)

      const actual = isAtPos(position, piece)

      expect(actual).toEqual(false)
    })

    it('should return false if piece is not at the given position and at destination', () => {
      const position = 12
      const piece = toPiece(2, true)

      const actual = isAtPos(position, piece)

      expect(actual).toEqual(false)
    })

    it('should be curried', () => {
      const position = 12
      const piece = toPiece(12, false)
      const expected = isAtPos(position, piece)

      const actual = isAtPos(position)(piece)

      expect(actual).toEqual(expected)
    })
  })

  describe('update', () => {
    const setup = () => {
      return {
        selector: 'a.b.c[0].d',
        fn: (n) => n + 1,
        obj: { a: { b: { c: [{ d: 56 }] } } }
      }
    }

    it('should update a deeply nested value', () => {
      const { fn, obj } = setup()
      const selector = 'a.b.c[0].d'

      const actual = update(selector, fn, obj)

      expect(actual.a.b.c[0].d).toEqual(57)
    })

    it('should work with an array notation', () => {
      const { fn, obj } = setup()
      const selector = ['a', 'b', 'c', 0, 'd']

      const actual = update(selector, fn, obj)

      expect(actual.a.b.c[0].d).toEqual(57)
    })

    it('should be curried', () => {
      const { fn, obj } = setup()
      const selector = 'a.b.c[0].d'

      const actual = update(selector)(fn)(obj)

      expect(actual.a.b.c[0].d).toEqual(57)
    })
  })

  describe('flowSkipOnError', () => {
    const setup = () => {
      const error = 'error was set'
      return {
        error,
        incrementVal: update('val', (n) => n + 1),
        setError: _.assign({error}),
        obj: {
          val: 0,
          error: null
        }
      }
    }

    it('should apply all functions when error is never set', () => {
      const { incrementVal, obj } = setup()

      const actual = flowSkipOnError(
        incrementVal,
        incrementVal,
        incrementVal
      )(obj)

      expect(actual.val).toEqual(3)
      expect(actual.error).toEqual(null)
    })

    it('should apply all functions until error is set', () => {
      const { incrementVal, setError, obj, error } = setup()

      const actual = flowSkipOnError(
        incrementVal,
        setError,
        incrementVal,
        incrementVal
      )(obj)

      expect(actual.val).toEqual(1)
      expect(actual.error).toEqual(error)
    })
  })

  describe('applyIf', () => {
    const setup = () => {
      return {
        okToTrue: _.assign({ok: true}),
        okToFalse: _.assign({ok: false}),
        obj: {
          a: 10
        }
      }
    }

    it('should apply fnTrue if cond(obj) is true', () => {
      const { okToTrue, okToFalse, obj } = setup()
      const cond = (o) => o.a === 10

      const actual = applyIf(cond, okToTrue, okToFalse)(obj)

      expect(actual.ok).toEqual(true)
    })

    it('should apply fnTrue if cond(obj) is truthy', () => {
      const { okToTrue, okToFalse, obj } = setup()
      const cond = (o) => 2

      const actual = applyIf(cond, okToTrue, okToFalse)(obj)

      expect(actual.ok).toEqual(true)
    })

    it('should apply fnFalse if cond(obj) is false', () => {
      const { okToTrue, okToFalse, obj } = setup()
      const cond = (o) => o.a !== 10

      const actual = applyIf(cond, okToTrue, okToFalse)(obj)

      expect(actual.ok).toEqual(false)
    })

    it('should apply fnFalse if cond(obj) is falsy', () => {
      const { okToTrue, okToFalse, obj } = setup()
      const cond = (o) => 0

      const actual = applyIf(cond, okToTrue, okToFalse)(obj)

      expect(actual.ok).toEqual(false)
    })

    it('should not update obj if cond(obj) is false and fnFalse is not given', () => {
      const { okToTrue, obj } = setup()
      const cond = (o) => o.a !== 10

      const actual = applyIf(cond, okToTrue)(obj)

      expect(actual.ok).toEqual(undefined)
    })

    it('should apply fnTrue if cond is a truthy non-function value', () => {
      const { okToTrue, okToFalse, obj } = setup()
      const cond = 2

      const actual = applyIf(cond, okToTrue, okToFalse)(obj)

      expect(actual.ok).toEqual(true)
    })

    it('should apply fnFalse if cond is a falsy non-function value', () => {
      const { okToTrue, okToFalse, obj } = setup()
      const cond = 0

      const actual = applyIf(cond, okToTrue, okToFalse)(obj)

      expect(actual.ok).toEqual(false)
    })
  })

  describe('setErrorIf', () => {
    const setup = () => {
      return {
        error: 'error was set',
        obj: {
          a: 10,
          error: null
        }
      }
    }

    it('should set an error if cond(obj) is true', () => {
      const { error, obj } = setup()
      const cond = (o) => o.a === 10

      const actual = setErrorIf(cond, error)(obj)

      expect(actual.error).toEqual(error)
    })

    it('should set an error if cond(obj) is truthy', () => {
      const { error, obj } = setup()
      const cond = (o) => 2

      const actual = setErrorIf(cond, error)(obj)

      expect(actual.error).toEqual(error)
    })

    it('should not set an error if cond(obj) is false', () => {
      const { error, obj } = setup()
      const cond = (o) => o.a !== 10

      const actual = setErrorIf(cond, error)(obj)

      expect(actual.error).toEqual(null)
    })

    it('should not set an error if cond(obj) is falsy', () => {
      const { error, obj } = setup()
      const cond = (o) => 0

      const actual = setErrorIf(cond, error)(obj)

      expect(actual.error).toEqual(null)
    })

    it('should set an error if cond is a truthy non-function value', () => {
      const { error, obj } = setup()
      const cond = 2

      const actual = setErrorIf(cond, error)(obj)

      expect(actual.error).toEqual(error)
    })

    it('should not set an error if cond is a falsy non-function value', () => {
      const { error, obj } = setup()
      const cond = 0

      const actual = setErrorIf(cond, error)(obj)

      expect(actual.error).toEqual(null)
    })
  })
})
