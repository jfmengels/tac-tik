import _ from 'lodash/fp'

import { removeAtPosition, ifNoError, applyToKeyAndAssign, applyToIndexAndAssign } from './common'

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
      applyToKeyAndAssign('pieces', (p) => p.concat(newPiece(id, newPos))),
      // === state.players[playerToGiveAPieceTo].piecesInStock--
      applyToKeyAndAssign('players',
        applyToIndexAndAssign(id,
          applyToKeyAndAssign('piecesInStock', (n) => n - 1)
        )
      )
    ))
  )(state)
})
