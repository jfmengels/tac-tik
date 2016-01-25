import _ from 'lodash/fp'

import { isAtPos, update, setErrorIf, flowSkipOnError } from '../fp-utils'

const pieceIsBlocking = (piece) =>
  piece.isBlocking

/**
 * Remove a piece from the board if one sits at the given position.
 * @param  {int} position position on the board
 * @param  {state} state state of the app
 * @return {state} Updated state.
 * - Untouched state if no piece was at the given position
 * - State with the piece removed from the board if one was at the given position
 * - State with untouched board but with an error if a blocking piece was at the given position
 */
export default _.curry((position, state) => {
  const isAtPosition = isAtPos(position)
  const piecesAtGivenPosition = state.pieces.filter(isAtPosition)
  if (piecesAtGivenPosition.length === 0) {
    return state
  }

  const pieceIsBlockingError = `Can't remove a blocking piece from the board`

  return flowSkipOnError(
    setErrorIf(pieceIsBlocking(piecesAtGivenPosition[0]), pieceIsBlockingError),
    // Put a piece back in the owner's stock
    update(['players', piecesAtGivenPosition[0].player, 'piecesInStock'], (n) => n + 1),
    // Remove piece at given position
    update('pieces', _.remove(isAtPosition))
  )(state)
})
