import _ from 'lodash/fp'

import { ifNoError, applyTo } from '../utils'

const setErrorIfOnePieceWasNotFound = _.curry((playerId, index1, index2, state) => {
  const error = `Could not find one of the pieces`
  if (index1 === -1 || index2 === -1) {
    return _.assign({error}, state)
  }
  return state
})

const setErrorIfNoneOfThePiecesAreYourOwn = _.curry((playerId, index1, index2, state) => {
  const error = `Can't exchange two pieces that are not your own`
  if (state.pieces[index1].player !== playerId && state.pieces[index2].player !== playerId) {
    return _.assign({error}, state)
  }
  return state
})

const setErrorIfBlockingPieceFromOtherPlayer = _.curry((playerId, index1, index2, state) => {
  const error = `Can't exchange with a blocking piece from an other player`
  if (state.pieces[index1].player !== playerId && state.pieces[index1].isBlocking) {
    return _.assign({error}, state)
  }
  if (state.pieces[index2].player !== playerId && state.pieces[index2].isBlocking) {
    return _.assign({error}, state)
  }
  return state
})

export default _.curry((playerId, pos1, pos2, state) => {
  const index1 = _.findIndex({pos: pos1}, state.pieces)
  const index2 = _.findIndex({pos: pos2}, state.pieces)

  return _.flow(
    setErrorIfOnePieceWasNotFound(playerId, index1, index2),
    ifNoError(
      setErrorIfNoneOfThePiecesAreYourOwn(playerId, index1, index2)
    ),
    ifNoError(
      setErrorIfBlockingPieceFromOtherPlayer(playerId, index1, index2)
    ),
    ifNoError(_.flow(
      applyTo(['pieces', index1], _.assign({isBlocking: false, pos: pos2})),
      applyTo(['pieces', index2], _.assign({isBlocking: false, pos: pos1}))
    ))
  )(state)
})
