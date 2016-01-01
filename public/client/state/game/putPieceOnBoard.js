import _ from 'lodash'

import { removeAtPosition, conditionalUpdater } from './common'

const newPiece = (player, pos) => ({
  player,
  pos,
  isBlocking: true,
  isAtDestination: false
})

export default (id, state) => {
  const newPos = id * state.parameters.distanceBetweenPlayers

  const updater = {
    players: {
      [id]: {
        piecesInStock: (n) => n - 1
      }
    },
    pieces: (p) => p.concat(newPiece(id, newPos))
  }

  return _.flow(
    _.partial(removeAtPosition, newPos),
    conditionalUpdater(updater)
  )(state)
}
