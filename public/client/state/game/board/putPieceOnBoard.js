import _ from 'lodash/fp'

import { update, flowSkipOnError } from '../utils'
import removePiece from './removePiece'

const newPiece = (player, pos) => ({
  player,
  pos,
  isBlocking: true,
  isHome: false
})

export default _.curry((id, state) => {
  const newPos = id * state.parameters.distanceBetweenPlayers

  return flowSkipOnError(
    removePiece(newPos),
    // Add new piece to the board
    update('pieces', (p) => p.concat(newPiece(id, newPos))),
    // Decrement the player's stock
    update(['players', id, 'piecesInStock'], (n) => n - 1)
  )(state)
})
