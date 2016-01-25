import _ from 'lodash/fp'

import { update, flowSkipOnError, setErrorIf } from '../fp-utils'
import { putPieceOnBoard, movePiece, exchangePieces, multiMove } from '../board'

const totalNumberOfStepsDoesNotEqualCardValue = (cardValue, moves) =>
  _.sumBy(_.get('steps'), moves) !== cardValue

const findCardOperation = (playerId, card, cardOptions) => {
  if (card.action === 'START' && cardOptions.newPiece === true) {
    return putPieceOnBoard(playerId)
  }
  if (card.action === 'MOVE' || card.action === 'START') {
    return movePiece(playerId, cardOptions.pos, card.value)
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

const cardIsNotInPlayerHand = (playerId, card) => _.flow(
  _.get(['players', playerId, 'cards']),
  _.find(card),
  _.negate(_.identity)
)

/**
 * Play a card and apply its actions on the board.
 * Will abort and set an error if:
 * - The card to play is not in the player's hand
 * - The move is invalid for some reason
 * The played card will be removed from the player's hand.
 * @param  {object} action action to apply, of the form:
 * {
 *   player: int,        // Id of the player making the action
 *   card: card,         // card to play
 *   cardOptions: object // data further describing the action to play.
 * }
 *
 * if card.action is:
 * - 'MOVE', then cardOptions must have field `pos`, which is the position of the piece to move.
 * - 'START', then cardOptions must have field `newPiece`. If it is set to false, will do the same thing a 'MOVE'.
 * Otherwise it will put a new piece on the board.
 * - 'PERMUTE', then cardOptions must have field `pos`, which is an array of two positions on the board,
 * and the pieces at either position will be swapped.
 * - 'MOVE', then cardOptions must have field `moves`, which is an array of objects of the form:
 * {
 *   pos: int,   // Position of the piece to move
 *   steps: int  // Number of steps to move the piece
 * }
 * @param  {object} state State of the game
 * @return {object} Updated state of the game
 */
export default ({playerId, card, cardOptions}, state) => {
  const cardIsNotInPlayerHandError = `Could not play card absent from player's hand`

  return flowSkipOnError(
    setErrorIf(cardIsNotInPlayerHand(playerId, card), cardIsNotInPlayerHandError),
    findCardOperation(playerId, card, cardOptions),
    update(['players', playerId, 'cards'], _.remove(card))
  )(state)
}
