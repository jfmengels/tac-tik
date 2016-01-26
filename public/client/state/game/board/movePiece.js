import _ from 'lodash/fp'

import { isAtPos, update, setErrorIf, flowSkipOnError } from '../fp-utils'
import removePiece from './removePiece'

const inBetween = (startPos, endPos) => ({pos}) => {
  if (endPos < startPos) { // Looping the board
    return pos <= endPos || startPos < pos
  }
  return startPos < pos && pos <= endPos
}

const isBlocked = (startPos, endPos) => _.flow(
  _.get('pieces'),
  _.filter((p) => p.isBlocking),
  _.filter(inBetween(startPos, endPos)),
  (p) => p.length > 0
)

const findPiece = (pos, state) =>
  _.flow(
    _.get('pieces'),
    _.find((p) => p.pos === pos)
  )(state)

const pieceIsNotOwn = (player, piece) =>
  piece && piece.player !== player

const doesNotExist = (piece) =>
  !piece

/**
 * Move a piece on the board by a given number of steps.
 * Will abort and set an error if:
 * - There is no piece at the given position
 * - The moving piece is not from the given player
 * - The move is blocked by a blocking piece on the board
 * Will remove a non-blocking piece from the board if it is at the position the moved piece ends up.
 * If the piece to move is in the blocking state, it will be made non-blocking.
 * @param  {int} player   Id of the player who made the action
 * @param  {int} pos      Position of the piece to move
 * @param  {int} steps    Number of steps to move (can be a negative number) the piece.
 * @param  {object} state State of the game
 * @return {object} Updated state of the game
 */
export default _.curry((player, pos, steps, state) => {
  const atPos = isAtPos(pos)
  const newPos = (pos + steps) % (state.parameters.numberOfPlayers * state.parameters.distanceBetweenPlayers)
  const piece = findPiece(pos, state)

  const blockedError = `Can't remove a blocking piece from the board`
  const noPieceAtGivenPositionError = `There is no piece at the given position`
  const pieceNotOwnError = `Can't move a piece from another player`

  return flowSkipOnError(
    setErrorIf(doesNotExist(piece), noPieceAtGivenPositionError),
    setErrorIf(pieceIsNotOwn(player, piece), pieceNotOwnError),
    setErrorIf(isBlocked(pos, newPos), blockedError),
    removePiece(newPos),
    update('pieces', _.map(
      (p) => {
        if (!atPos(p)) { return p }
        return _.assign(p, {pos: newPos, isBlocking: false})
      }
    ))
  )(state)
})
