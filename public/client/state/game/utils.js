import _ from 'lodash/fp'

/**
 * Returns a function that will tell whether a piece is at the given position on the board.
 * Will only return true if the piece is not at in the destination locations.
 * @param {int} position Position on the board to look at to look at
 * @param {object} piece Object containing the position of the piece and whether it's in the destination locations.
 * @return {boolean} true if piece is at the given position but not in the destination locations, false otherwise.
 */
export const isAtPos = _.curry((position, {pos, isAtDestination}) =>
  pos === position && !isAtDestination
)

/**
 * Applies a function to the data targetted by selector inside obj (using lodash's _.get),
 * and updates obj with the new value at the same location.
 * Example: applyTo('a.b', (n) => n + 1, { a: { b: 2 } }) --> { a: { b: 3 } }
 * @param  {string} selector Data selector used by lodash's _.set and _.get
 * @return {function} fn     Function to apply to the value
 * @return {object} obj      Object to apply changes to.
 */
export const applyTo = _.curry((selector, fn, obj) => {
  const value = fn(_.get(selector, obj))
  return _.set(value, selector, obj)
})

/**
 * Apply function to state if state.error is falsy, returns state untouched otherwise
 * @param  {fn} Function to apply
 * @return {state} state, updated or not
 */
export const ifNoError = (fn) =>
  (state) => state.error ? state : fn(state)
