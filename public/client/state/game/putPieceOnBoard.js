import _ from 'lodash/fp'

import { removeAtPosition, ifNoError, applyTo } from './common'

const newPiece = (player, pos) => ({
  player,
  pos,
  isBlocking: true,
  isAtDestination: false
})

export default _.curry((id, state) => {
  const newPos = id * state.parameters.distanceBetweenPlayers

  return _.flow(
    removeAtPosition(newPos),
    ifNoError(_.flow(
      // Add new piece to the board
      applyTo('pieces', (p) => p.concat(newPiece(id, newPos))),
      applyTo(`players[${id}].piecesInStock`, (n) => n -1)
    ))
  )(state)
})
