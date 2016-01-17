import _ from 'lodash/fp'

import { isAtPos, applyTo } from '../utils'

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

  const {player, isBlocking} = piecesAtGivenPosition[0]
  if (isBlocking) {
    return _.assign({error: `Can't remove a blocking piece from the board`}, state)
  }

  return _.flow(
    // Put a piece back in the owner's stock
    applyTo(`players[${player}].piecesInStock`, (n) => n + 1),
    // Remove piece at given position
    applyTo('pieces', _.remove(isAtPosition))
  )(state)
})
