import u from 'updeep'

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

/**
 * Remove a piece from the board if one sits at the given position.
 * @param  {int} position position on the board
 * @param  {state} state state of the app
 * @return {state} Updated state.
 * - Untouched state if no piece was at the given position
 * - State with the piece removed from the board if one was at the given position
 * - State with Untouched board but with an error if a blocking piece was at the given position
 */
export const removeAtPosition = (position, state) => {
  let updater = {
    pieces: (p) => p.filter(atPos(false, position)),
    error: null
  }

  const piecesAtGivenPosition = state.pieces.filter(atPos(true, position))
  if (piecesAtGivenPosition.length === 1) {
    const {player, isBlocking} = piecesAtGivenPosition[0]
    if (isBlocking) {
      updater = {
        error: `Can't remove a blocking piece from the board`
      }
    } else {
      updater.players = {
        [player]: {
          piecesInStock: (n) => n + 1
        }
      }
    }
  }
  return u(updater, state)
}

/**
 * Apply updater if state has no error
 * @param  {updeep object} updater State updater to apply
 * @return {state} state, updated or not
 */
export const conditionalUpdater = (updater) =>
  (state) => {
    if (state.error) { return state }
    return u(updater, state)
  }
