import _ from 'lodash'
import u from 'updeep'

import { createReducer } from '../utils'

const prefix = 'game/'
const PUT_PIECE_ON_BOARD = prefix + 'PUT_PIECE_ON_BOARD'

const numberOfPlayers = 4
const distanceBetweenStocks = 16

const newPiece = (player, pos) => ({
  player,
  pos,
  isBlocking: true,
  isAtDestination: false
})

const removeAtPosition = (position, state) => {
  const atPos =
    (wanted) =>
      ({pos, isAtDestination}) =>
        (pos === position) === wanted && !isAtDestination

  const updater = {
    pieces: (p) => p.filter(atPos(false))
  }

  const piecesAtGivenPosition = state.pieces.filter(atPos(true))
  if (piecesAtGivenPosition.length === 1) {
    const {player, isBlocking} = piecesAtGivenPosition[0]
    updater.players = {
      [player]: {
        piecesInStock: (n) => n + 1
      }
    }
    if (isBlocking) {
      updater.error = `Can't put a new piece on the board because an other piece is blocking`;
    }
  }
  return u(updater, state)
}

const putPieceOnBoardReducer = (state, {id}) => {
  const newPos = id * distanceBetweenStocks

  const updater = {
    players: {
      [id]: {
        piecesInStock: (n) => n - 1
      }
    },
    pieces: (p) => p.concat(newPiece(id, newPos))
  }

  return _.flow(
    _.partial(removeAtPosition, newPos),
    _.partial(u, updater)
  )(state)
}

// const piecePosition = {
//   player: <number>,
//   isAtDestination: <boolean>,
//   pos: <number
//        ; 0-3 if at destination
//        , 0-(numberOfPlayers * distanceBetweenStocks) otherwise>,
//   isBlocking: <boolean>
// }
const partnerId = (id) => (id + (numberOfPlayers / 2)) % numberOfPlayers

const player = (id) => ({
  id,
  piecesInStock: 4,
  partnerId: partnerId(id),
  cards: []
})

const initialState = {
  players: [0, 1, 2, 3].map(player),
  pieces: [],
  cardsInDeck: [],
  error: null
}

export default createReducer(initialState, {
  [PUT_PIECE_ON_BOARD]: putPieceOnBoardReducer
})

export const putPieceOnBoard = (id) => ({
  type: PUT_PIECE_ON_BOARD,
  id
})
