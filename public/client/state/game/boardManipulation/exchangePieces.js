import _ from 'lodash/fp'

import { applyTo, flowSkipOnError, setErrorIf } from '../utils'

const onePieceWasNotFound = (playerId, index1, index2) => () =>
  index1 === -1 || index2 === -1

const isFromDifferentPlayer = _.curry((playerId, state, index) =>
  state.pieces[index].player !== playerId
)

const noneOfThePiecesAreYourOwn = _.curry((playerId, index1, index2, state) => {
  const fromDifferentPlayer = isFromDifferentPlayer(playerId, state)
  return fromDifferentPlayer(index1) && fromDifferentPlayer(index2)
})

const isFromOtherPlayerAndBlocking = _.curry((playerId, state, index) =>
  state.pieces[index].player !== playerId && state.pieces[index].isBlocking
)

const pieceFromOtherPlayerIsBlocking = _.curry((playerId, index1, index2, state) => {
  const isBlocked = isFromOtherPlayerAndBlocking(playerId, state)
  return isBlocked(index1) || isBlocked(index2)
})

export default _.curry((playerId, pos1, pos2, state) => {
  const index1 = _.findIndex({pos: pos1}, state.pieces)
  const index2 = _.findIndex({pos: pos2}, state.pieces)

  const onePieceWasNotFoundError = `Could not find one of the pieces`
  const noneOfThePiecesAreYourOwnError = `Can't exchange two pieces that are not your own`
  const pieceFromOtherPlayerIsBlockingError = `Can't exchange with a blocking piece from an other player`

  return flowSkipOnError(
    setErrorIf(onePieceWasNotFound(playerId, index1, index2), onePieceWasNotFoundError),
    setErrorIf(noneOfThePiecesAreYourOwn(playerId, index1, index2), noneOfThePiecesAreYourOwnError),
    setErrorIf(pieceFromOtherPlayerIsBlocking(playerId, index1, index2), pieceFromOtherPlayerIsBlockingError),
    applyTo(['pieces', index1], _.assign({isBlocking: false, pos: pos2})),
    applyTo(['pieces', index2], _.assign({isBlocking: false, pos: pos1}))
  )(state)
})
