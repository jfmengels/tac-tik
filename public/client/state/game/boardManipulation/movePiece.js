import _ from 'lodash/fp'

import { isAtPos, ifNoError, applyTo } from '../utils'
import removePiece from './removePiece'

const inBetween = _.curry((startPos, endPos, {pos}) => {
  if (endPos < startPos) { // Looping the board
    return pos <= endPos || startPos < pos
  }
  return startPos < pos && pos <= endPos
})

const isBlocked = (startPos, endPos) => _.flow(
  _.get('pieces'),
  _.filter((p) => p.isBlocking),
  _.filter(inBetween(startPos, endPos)),
  (p) => p.length > 0
)

export default _.curry((pos, steps, state) => {
  const atPos = isAtPos(pos)
  const newPos = (pos + steps) % (state.parameters.numberOfPlayers * state.parameters.distanceBetweenPlayers)

  if (isBlocked(pos, newPos)(state)) {
    return _.assign({
      error: `Can't remove a blocking piece from the board`
    }, state)
  }

  return _.flow(
    removePiece(newPos),
    ifNoError(
      applyTo('pieces', _.map(
        (p) => {
          if (!atPos(p)) { return p }
          return _.assign({pos: newPos, isBlocking: false}, p)
        }
      ))
    )
  )(state)
})
