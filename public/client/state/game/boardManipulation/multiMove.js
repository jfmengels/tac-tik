import _ from 'lodash/fp'

import movePiece from './movePiece'
import { flowSkipOnError } from '../utils'

// Map move to an array of 1-step `movePiece()`s
const mapMoveToNTimes1MovePiece = (player) => ({pos, steps}) => {
  return _.flow(
    _.times(_.identity),
    _.map((offset) => movePiece(player, pos + offset, 1))
  )(steps)
}

// Map moves to an array of 1-step `movePiece()`s
const mapMovesToFns = (player, moves) =>
  _.flatMap(mapMoveToNTimes1MovePiece(player), moves)

const revertOnError = (fn, initialState) => {
  const newState = fn(initialState)
  return newState.error
    ? {...initialState, error: newState.error}
    : newState
}

export default _.curry((player, moves, state) => {
  const fns = mapMovesToFns(player, moves)
  return revertOnError(flowSkipOnError(...fns), state)
})
