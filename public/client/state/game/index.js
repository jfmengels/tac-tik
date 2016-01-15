import _ from 'lodash/fp'

import createNewDeck from './cards'
import distributeCards from './distributeCards'
import putPieceOnBoard from './putPieceOnBoard'
import movePiece from './movePiece'
import { ifNoError, applyTo } from './common'
import { createReducer } from '../utils'

const prefix = 'game/'
const PLAY_CARD = prefix + 'PLAY_CARD'

const playCardReducer = (state, {playerId, card, cardOptions}) => {
  const foundCard = _.find(card, state.players[playerId].cards)
  if (!foundCard) {
    return _.assign({error: `Could not play card absent from player's hand`}, state)
  }

  const selector = `players[${playerId}].cards`
  const update = applyTo(selector, _.filter(_.flow(
    // _.isEqual is not data-last. Should be fixed in the next release of lodash
    _.partial(_.isEqual, _, card),
    (b) => !b
  )))

  let operation
  if (card.action === 'START' && cardOptions.newPiece === true) {
    operation = putPieceOnBoard(playerId)
  } else if (card.action === 'MOVE' || card.action === 'START') {
    operation = movePiece(cardOptions.piece, card.value)
  }

  return _.flow(
    operation,
    ifNoError(update)
  )(state)
}

const partnerId = (id, numberOfPlayers) =>
  (id + (numberOfPlayers / 2)) % numberOfPlayers

const newPlayer = _.curry((numberOfPlayers, id) => ({
  id,
  piecesInStock: 4,
  partnerId: partnerId(id, numberOfPlayers),
  cards: []
}))

// const piecePosition = {
//   player: <number>,
//   isAtDestination: <boolean>,
//   pos: <number
//        ; 0-3 if at destination
//        , 0-(numberOfPlayers * distanceBetweenPlayers) otherwise>,
//   isBlocking: <boolean>
// }
const initialState = distributeCards(createNewDeck(), {
  players: [0, 1, 2, 3].map(newPlayer(4)),
  pieces: [],
  cardsInDeck: [],
  error: null,
  parameters: {
    numberOfPlayers: 4,
    distanceBetweenPlayers: 16
  }
})

export default createReducer(initialState, {
  [PLAY_CARD]: playCardReducer
})

export const playCard = (playerId, card, cardOptions) => ({
  type: PLAY_CARD,
  playerId,
  card,
  cardOptions
})
