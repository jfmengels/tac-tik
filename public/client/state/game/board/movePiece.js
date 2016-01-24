import _ from 'lodash/fp'

import { isAtPos, update, setErrorIf, flowSkipOnError } from '../utils'
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
        return _.assign({pos: newPos, isBlocking: false}, p)
      }
    ))
  )(state)
})
