import _ from 'lodash/fp'

import { update, flowSkipOnError, setErrorIf } from './utils'
import { putPieceOnBoard, movePiece, exchangePieces, multiMove } from './board'

const totalNumberOfStepsDoesNotEqualCardValue = (cardValue, moves) =>
  _.sumBy(_.get('steps'), moves) !== cardValue

const findCardOperation = (playerId, card, cardOptions) => {
  if (card.action === 'START' && cardOptions.newPiece === true) {
    return putPieceOnBoard(playerId)
  }
  if (card.action === 'MOVE' || card.action === 'START') {
    return movePiece(playerId, cardOptions.piece, card.value)
  }
  if (card.action === 'PERMUTE') {
    return exchangePieces(playerId, cardOptions.pos[0], cardOptions.pos[1])
  }
  if (card.action === 'MULTI') {
    const notEqualError = `Total number of steps does not equal the card value`
    return flowSkipOnError(
      setErrorIf(totalNumberOfStepsDoesNotEqualCardValue(card.value, cardOptions.moves), notEqualError),
      multiMove(playerId, cardOptions.moves)
    )
  }
  return _.assign({error: 'Unknown card action'})
}

export default ({playerId, card, cardOptions}, state) => {
  const foundCard = _.find(card, state.players[playerId].cards)
  if (!foundCard) {
    return _.assign({error: `Could not play card absent from player's hand`}, state)
  }


  return flowSkipOnError(
    findCardOperation(playerId, card, cardOptions),
    update(['players', playerId, 'cards'], _.remove(card))
  )(state)
}
