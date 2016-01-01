import _ from 'lodash'
import u from 'updeep'

import { atPos, removeAtPosition, conditionalUpdater } from './common'

const inBetween = (startPos, endPos) =>
({pos}) => {
  if (endPos < startPos) { // Looping the board
    return pos <= endPos || startPos < pos
  }
  return startPos < pos && pos <= endPos
}

const hasBlockingElements = (startPos, endPos, state) =>
state.pieces
  .filter(({isBlocking}) => isBlocking)
  .filter(inBetween(startPos, endPos))
  .length > 0


export default (pos, steps, state) => {
  const newPos = (pos + steps) % (state.parameters.numberOfPlayers * state.parameters.distanceBetweenPlayers)
  const notAtPos = atPos(false, pos)

  if (hasBlockingElements(pos, newPos, state)) {
    return u({
      error: `Can't remove a blocking piece from the board`
    }, state)
  }

  const updater = {
    pieces: u.map((piece) => {
      if (notAtPos(piece)) {
        return piece
      }
      return u({
        pos: newPos,
        isBlocking: false
      }, piece)
    }),
    error: null
  }

  return _.flow(
    _.partial(removeAtPosition, newPos),
    conditionalUpdater(updater)
  )(state)
}
