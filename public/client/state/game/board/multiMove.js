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

/**
* Moves one or several pieces on the board by one step increments.
* Will abort and set an error if for one of the moves:
* - There is no piece at the given position
* - The moving piece is not from the given player
* - The move is blocked by a blocking piece on the board
* Will remove non-blocking pieces from the board if they are at any final
* or intermediate position that one of the moved pieces ends up at.
* Any blocking moved pieces will be made non-blocking.
* @param  {int} player   Id of the player who made the action
* @param  {move[]} moves Array of moves of the form
* {
*   pos: int,   // Position of the piece to move
*   steps: int  // Number of steps to move the piece
* }
* @param  {object} state State of the game
* @return {object} Updated state of the game
*/
export default _.curry((player, moves, state) => {
  const fns = mapMovesToFns(player, moves)
  return revertOnError(flowSkipOnError(...fns), state)
})
