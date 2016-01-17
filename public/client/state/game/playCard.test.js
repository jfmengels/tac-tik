import _ from 'lodash/fp'
import expect from 'expect'

import reducer, { playCard } from './'

const playStartCard = (state) => {
  const card = state.players[2].cards[0] // 10/start card
  const cardOptions = { newPiece: true }
  return reducer(state, playCard(2, card, cardOptions))
}

describe('game - playing a card', () => {
  let startState

  beforeEach(() => {
    startState = reducer(undefined, { type: '@@INIT' })
    startState.players[2].cards = [
      {value: 10, action: 'START', color: 'blue'},
      {value: 10, action: 'START', color: 'green'},
      {value: 10, action: 'START', color: 'red'},
      {value: 8, action: 'MOVE', color: 'blue'}
    ]
  })

  it(`should remove the played card from the player's hand (first played card)`, () => {
    const previousCards = startState.players[2].cards
    const card = previousCards[0]

    const state = playStartCard(startState)

    const newCards = state.players[2].cards
    expect(newCards.length).toEqual(3)
    expect(_.find(newCards, card)).toEqual(undefined)
    expect([card].concat(newCards), 'value')
      .toEqual(previousCards, 'value')
  })

  it(`should remove the played card from the player's hand (second played card)`, () => {
    const tmpState = playStartCard(startState)
    const previousCards = tmpState.players[2].cards
    const card = previousCards[2]
    const cardOptions = { newPiece: false, piece: 2 * 16 }

    const state = reducer(tmpState, playCard(2, card, cardOptions))

    const newCards = state.players[2].cards
    expect(newCards.length).toEqual(2)
    expect(_.find(newCards, card)).toEqual(undefined)
    expect(newCards.concat(card), 'value')
      .toEqual(previousCards, 'value')
  })

  it(`should put a piece on the board from a played 'start' card`, () => {
    const state = playStartCard(startState)

    expect(state.players[2].piecesInStock).toEqual(3)
    expect(state.pieces.length).toEqual(1)
    const piece = state.pieces[0]
    expect(piece.player).toEqual(2)
    expect(piece.pos).toEqual(2 * 16)
    expect(piece.isBlocking).toEqual(true)
    expect(piece.isAtDestination).toEqual(false)
  })

  it(`should move a piece on the board from a played 'move' card`, () => {
    // Setup: put a piece on the board
    const tmpState = playStartCard(startState)
    const card = tmpState.players[2].cards[0] // 10/start card
    const cardOptions = { newPiece: false, piece: 2 * 16 }

    const state = reducer(tmpState, playCard(2, card, cardOptions))

    expect(state.error).toEqual(null)
    expect(state.players[2].piecesInStock).toEqual(3)
    expect(state.pieces.length).toEqual(1)
    const piece = state.pieces[0]
    expect(piece.player).toEqual(2)
    expect(piece.pos).toEqual(2 * 16 + 10)
    expect(piece.isBlocking).toEqual(false)
    expect(piece.isAtDestination).toEqual(false)
  })

  it(`should move a piece on the board from a played 'start' card`, () => {
    // Setup: put a piece on the board
    const tmpState = playStartCard(startState)
    const card = tmpState.players[2].cards[2] // 8/move card
    const cardOptions = { piece: 2 * 16 }

    const state = reducer(tmpState, playCard(2, card, cardOptions))

    expect(state.error).toEqual(null)
    expect(state.players[2].piecesInStock).toEqual(3)
    expect(state.pieces.length).toEqual(1)
    const piece = state.pieces[0]
    expect(piece.player).toEqual(2)
    expect(piece.pos).toEqual(2 * 16 + 8)
    expect(piece.isBlocking).toEqual(false)
    expect(piece.isAtDestination).toEqual(false)
  })

  it(`should return state with an error and cancel card when playing invalid action`, () => {
    // Setup: put a piece on the board
    const tmpState = playStartCard(startState)
    const card = tmpState.players[2].cards[0] // 10/start card
    const cardOptions = { newPiece: true }

    // A blocking piece should make he action invalid
    const state = reducer(tmpState, playCard(2, card, cardOptions))

    expect(state.error).toEqual(`Can't remove a blocking piece from the board`)
    expect(state.players).toEqual(state.players, 'player info should not have been modified')
    expect(state.pieces).toEqual(state.pieces, 'board pieces should not have been modified')
  })

  it(`should return state with an error and cancel card when playing a card not in the player's hand`, () => {
    const card = {value: 10, action: 'START', color: 'yellow'}
    const cardOptions = { newPiece: true }

    const state = reducer(startState, playCard(2, card, cardOptions))

    expect(state.error).toEqual(`Could not play card absent from player's hand`)
    expect(state.players).toEqual(state.players, 'player info should not have been modified')
    expect(state.pieces).toEqual(state.pieces, 'board pieces should not have been modified')
  })
})
