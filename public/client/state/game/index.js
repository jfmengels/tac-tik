import _ from 'lodash'
import u from 'updeep'

import { createNewDeck } from './cards'
// import { } from './cardAction'
import { createReducer } from '../utils'

const prefix = 'game/'
const PUT_PIECE_ON_BOARD = Symbol(prefix + 'PUT_PIECE_ON_BOARD')
const DISTRIBUTE_CARDS = Symbol(prefix + 'DISTRIBUTE_CARDS')
const MOVE_PIECE = Symbol(prefix + 'MOVE_PIECE')
const PLAY_CARD = Symbol(prefix + 'PLAY_CARD')

const numberOfPlayers = 4
const distanceBetweenPlayers = 16

const newPiece = (player, pos) => ({
  player,
  pos,
  isBlocking: true,
  isAtDestination: false
})

const atPos =
  (wanted, position) =>
    ({pos, isAtDestination}) =>
      (pos === position) === wanted && !isAtDestination

const conditionalUpdater = (updater) =>
  (state) => {
    if (state.error) { return state }
    return u(updater, state)
  }

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

const removeAtPosition = (position, state) => {
  let updater = {
    pieces: (p) => p.filter(atPos(false, position)),
    error: null
  }

  const piecesAtGivenPosition = state.pieces.filter(atPos(true, position))
  if (piecesAtGivenPosition.length === 1) {
    const {player, isBlocking} = piecesAtGivenPosition[0]
    if (isBlocking) {
      updater = {
        error: `Can't remove a blocking piece from the board`
      }
    } else {
      updater.players = {
        [player]: {
          piecesInStock: (n) => n + 1
        }
      }
    }
  }
  return u(updater, state)
}

const putPieceOnBoardReducer = (state, {id}) => {
  const newPos = id * distanceBetweenPlayers

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
    conditionalUpdater(updater)
  )(state)
}

const movePieceReducer = (state, {pos, steps}) => {
  const newPos = (pos + steps) % (numberOfPlayers * distanceBetweenPlayers)
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

const distributeCardsReducer = (state, {cards}) => {
  const cardsForEachPlayer = _.chunk(_.take(cards, 16), 4)

  const updater = {
    players: (players) => {
      return players.map((player, index) => {
        return Object.assign({}, player, {cards: cardsForEachPlayer[index]})
      })
    },
    cardsInDeck: _.takeRight(cards, cards.length - 16)
  }

  return u(updater, state)
}

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

const partnerId = (id) =>
  (id + (numberOfPlayers / 2)) % numberOfPlayers

const newPlayer = (id) => ({
  id,
  piecesInStock: 4,
  partnerId: partnerId(id),
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
const initialState = {
  players: [0, 1, 2, 3].map(newPlayer),
  pieces: [],
  cardsInDeck: [],
  error: null
}

export default createReducer(initialState, {
  [PUT_PIECE_ON_BOARD]: putPieceOnBoardReducer,
  [MOVE_PIECE]: movePieceReducer,
  [DISTRIBUTE_CARDS]: distributeCardsReducer,
  [PLAY_CARD]: playCardReducer
})

export const putPieceOnBoard = (id) => ({
  type: PUT_PIECE_ON_BOARD,
  id
})

export const movePiece = (pos, steps) => ({
  type: MOVE_PIECE,
  pos,
  steps
})

export const distributeCards = (cardsLeft) => ({
  type: DISTRIBUTE_CARDS,
  cards: cardsLeft.length !== 0 ? cardsLeft : createNewDeck()
})

export const playCard = (playerId, card) => ({
  type: PLAY_CARD,
  playerId,
  card
})
