import _ from 'lodash/fp'

import { ifNoError, applyTo } from './utils'
import { putPieceOnBoard, movePiece } from './boardManipulation'

export default (state, {playerId, card, cardOptions}) => {
  const foundCard = _.find(card, state.players[playerId].cards)
  if (!foundCard) {
    return _.assign({error: `Could not play card absent from player's hand`}, state)
  }

  const selector = `players[${playerId}].cards`
  // _.isEqual is not data-last. Should be fixed in the next release of lodash
  const update = applyTo(selector, _.remove(_.partial(_.isEqual, _, card)))

  let operation
  if (card.action === 'START' && cardOptions.newPiece === true) {
    operation = putPieceOnBoard(playerId)
  } else if (card.action === 'MOVE' || card.action === 'START') {
    operation = movePiece(cardOptions.piece, card.value)
  }

  return _.flow(
    operation,
    ifNoError(update)
  )(state)
}
