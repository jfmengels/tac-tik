import _ from 'lodash/fp'

import { applyTo, flowSkipOnError } from '../utils'
import removePiece from './removePiece'

const newPiece = (player, pos) => ({
  player,
  pos,
  isBlocking: true,
  isAtDestination: false
})

export default _.curry((id, state) => {
  const newPos = id * state.parameters.distanceBetweenPlayers

  return flowSkipOnError(
    removePiece(newPos),
    // Add new piece to the board
    applyTo('pieces', (p) => p.concat(newPiece(id, newPos))),
    // Decrement the player's stock
    applyTo(['players', id, 'piecesInStock'], (n) => n - 1)
  )(state)
})
