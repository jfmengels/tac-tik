import _ from 'lodash/fp'

/**
 * Returns a function that will tell whether a piece matches the position requirement.
 * The position requirement is either:
 * - at a position
 * - not at a position
 * @param  {boolean} wanted   Determines whether it should return true or false if a piece is at the given position
 * @param  {int} position     Position to look at
 * @return {boolean} boolean, according to previously explained logic
 */
export const atPos = (wanted, position) =>
  ({pos, isAtDestination}) =>
    (pos === position) === wanted && !isAtDestination

export const isAtPos = _.curry((position, {pos, isAtDestination}) =>
  pos === position && !isAtDestination
)

export const applyTo = _.curry((selector, fn, obj) => {
  const value = fn(_.get(selector, obj))
  return _.set(value, selector, obj)
})

/**
 * Remove a piece from the board if one sits at the given position.
 * @param  {int} position position on the board
 * @param  {state} state state of the app
 * @return {state} Updated state.
 * - Untouched state if no piece was at the given position
 * - State with the piece removed from the board if one was at the given position
 * - State with untouched board but with an error if a blocking piece was at the given position
 */
export const removeAtPosition = _.curry((position, state) => {
  const piecesAtGivenPosition = state.pieces.filter(atPos(true, position))
  if (piecesAtGivenPosition.length === 0) {
    return state
  }

  const {player, isBlocking} = piecesAtGivenPosition[0]
  if (isBlocking) {
    return _.assign({error: `Can't remove a blocking piece from the board`}, state)
  }

  return _.flow(
    // Remove piece at given position
    applyTo('pieces',
      _.filter(_.negate(isAtPos(position)))
    ),
    applyTo(`players[${player}].piecesInStock`, (n) => n + 1)
  )(state)
})

/**
 * Apply function to state if it has no error
 * @param  {fn} Function to apply
 * @return {state} state, updated or not
 */
export const ifNoError = (fn) =>
  (state) => state.error ? state : fn(state)
