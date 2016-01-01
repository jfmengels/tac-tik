import _ from 'lodash'
import u from 'updeep'

import createNewDeck from './cards'
import distributeCards from './distributeCards'
import { createReducer } from '../utils'

const prefix = 'game/'
const PLAY_CARD = prefix + 'PLAY_CARD'

const playCardReducer = (state, {playerId, card}) => {
  const updater = {
    players: (players) => {
      return players.map((player) => {
        if (player.id !== playerId) {
          return player
        }
        const filteredCards = player.cards.filter((c) => !_.isEqual(c, card))
        return Object.assign({}, player, {cards: filteredCards})
      })
    }
  }

  return u(updater, state)
}

const partnerId = (id, numberOfPlayers) =>
  (id + (numberOfPlayers / 2)) % numberOfPlayers

const newPlayer = (numberOfPlayers) =>
  (id) => ({
    id,
    piecesInStock: 4,
    partnerId: partnerId(id, numberOfPlayers),
    cards: []
  })

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

export const playCard = (playerId, card) => ({
  type: PLAY_CARD,
  playerId,
  card
})
