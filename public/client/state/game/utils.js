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
 * Same as Lodash's _.flow, but stops applying fns as soon as state.error is truthy
 * @param  {function[]} ...fns Functions to apply
 * @return {function} function that takes a state and applies fns to it
 */
export const flowSkipOnError = (...fns) => (state) => {
  return _.reduce(
    (currState, fn) => currState.error ? currState : fn(currState),
    state,
    fns
  )
}

/**
 * Assign the error field with `error` if fn(state) returns truthy.
 * @param  {Function} fn    Function returning a truthy/falsy value
 * @param  {string}   error Error to assign
 * @param  {object}   state State to optionally update
 * @return {object}         State, updated or left untouched
 */
export const setErrorIf = _.curry((fn, error, state) => {
  return fn(state) ? _.assign({error}, state) : state
})
