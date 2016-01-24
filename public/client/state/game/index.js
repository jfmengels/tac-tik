import { createNewDeck, distributeCards, playCard as playCardReducer } from './cards'
import { createReducer } from '../utils'

const prefix = 'game/'
const PLAY_CARD = prefix + 'PLAY_CARD'

const partnerId = (id, numberOfPlayers) =>
  (id + (numberOfPlayers / 2)) % numberOfPlayers

const newPlayer = (numberOfPlayers) => (id) => ({
  id,
  piecesInStock: 4,
  partnerId: partnerId(id, numberOfPlayers),
  cards: []
})

// const piecePosition = {
//   player: <number>,
//   isHome: <boolean>,
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
