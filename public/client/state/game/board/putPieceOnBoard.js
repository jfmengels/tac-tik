import _ from 'lodash/fp'

import { update, setErrorIf, flowSkipOnError } from '../fp-utils'
import removePiece from './removePiece'

const newPiece = (player, pos) => ({
  player,
  pos,
  isBlocking: true,
  isHome: false
})

const hasNoMorePiecesInStock = (id) => _.flow(
  _.get(['players', id, 'piecesInStock']),
  (n) => n === 0
)

/**
 * Put a piece from the given player's stock of pieces on the board.
 * It will be placed on the starting position of the player in a blocking state.
 * Will abort and set an error if:
 * - The player has no more pieces in stock
 * - There is already a blocking piece at the starting position.
 * @param  {int} playerId Id of the player who made the action
 * @param  {object} state State of the game
 * @return {object} Updated state of the game
 */
export default _.curry((id, state) => {
  const newPos = id * state.parameters.distanceBetweenPlayers
  const hasNoMorePiecesInStockError = `Can't put a new piece on the board because none are left in stock`

  return flowSkipOnError(
    setErrorIf(hasNoMorePiecesInStock(id), hasNoMorePiecesInStockError),
    removePiece(newPos),
    // Add new piece to the board
    update('pieces', (p) => p.concat(newPiece(id, newPos))),
    // Decrement the player's stock
    update(['players', id, 'piecesInStock'], (n) => n - 1)
  )(state)
})
