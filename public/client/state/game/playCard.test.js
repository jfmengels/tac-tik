import expect from 'expect'

import playCard from './playCard'

describe('game - playing a card', () => {
  let startState

  beforeEach(() => {
    startState = {
      pieces: [{
        pos: 2,
        player: 0,
        isBlocking: false,
        isAtDestination: false
      }, {
        pos: 16,
        player: 1,
        isBlocking: true,
        isAtDestination: false
      }],
      players: [
        {
          piecesInStock: 3,
          cards: [
            {value: 10, action: 'START', color: 'blue'},
            {value: 10, action: 'START', color: 'green'},
            {value: 10, action: 'START', color: 'red'},
            {value: 8, action: 'MOVE', color: 'blue'}
          ]
        },
        {
          piecesInStock: 3,
          cards: [
            {value: 1, action: 'START', color: 'red'},
            {value: 'PERMUTE', action: 'PERMUTE', color: 'red'},
            {value: 1, action: 'START', color: 'red'},
            {value: 6, action: 'MOVE', color: 'blue'}
          ]
        },
        {piecesInStock: 4, cards: []},
        {piecesInStock: 4, cards: []}
      ],
      parameters: {
        distanceBetweenPlayers: 16,
        numberOfPlayers: 4
      },
      error: null
    }
  })

  it(`should remove the played card from the player's hand`, () => {
    const previousCards = startState.players[0].cards
    const card = previousCards[1]
    const cardOptions = { newPiece: true }

    const state = playCard({playerId: 0, card, cardOptions}, startState)

    expect(state.players[0].cards).toEqual([
      {value: 10, action: 'START', color: 'blue'},
      {value: 10, action: 'START', color: 'red'},
      {value: 8, action: 'MOVE', color: 'blue'}
    ])
  })

  it(`should put a piece on the board from a played 'start' card`, () => {
    const previousCards = startState.players[0].cards
    const card = previousCards[1]
    const cardOptions = { newPiece: true }

    const state = playCard({playerId: 0, card, cardOptions}, startState)

    expect(state.error).toEqual(null)
    expect(state.players[0].piecesInStock).toEqual(2)
    expect(state.pieces.length).toEqual(3)
    expect(state.pieces[2]).toEqual({
      pos: 0,
      player: 0,
      isBlocking: true,
      isAtDestination: false
    })
  })

  it(`should move a piece on the board from a played 'move' card`, () => {
    const card = startState.players[0].cards[0] // 10/start card
    const cardOptions = { newPiece: false, piece: 2 }

    const state = playCard({playerId: 0, card, cardOptions}, startState)

    expect(state.error).toEqual(null)
    expect(state.players[0].piecesInStock).toEqual(3)
    expect(state.pieces.length).toEqual(2)
    expect(state.pieces[0]).toEqual({
      pos: 12,
      player: 0,
      isBlocking: false,
      isAtDestination: false
    })
  })

  it(`should move a piece on the board from a played 'move' card`, () => {
    const card = startState.players[0].cards[3] // 8/move card
    const cardOptions = { piece: 2 }

    const state = playCard({playerId: 0, card, cardOptions}, startState)

    expect(state.error).toEqual(null)
    expect(state.pieces[0]).toEqual({
      pos: 10,
      player: 0,
      isBlocking: false,
      isAtDestination: false
    })
  })

  it(`should move a piece on the board from a played 'permute' card`, () => {
    const card = startState.players[1].cards[1] // PERMUTE card
    const cardOptions = { pos: [2, 16] }

    const state = playCard({playerId: 1, card, cardOptions}, startState)

    expect(state.error).toEqual(null)
    expect(state.pieces[0]).toEqual({
      pos: 16,
      player: 0,
      isBlocking: false,
      isAtDestination: false
    })
    expect(state.pieces[1]).toEqual({
      pos: 2,
      player: 1,
      isBlocking: false,
      isAtDestination: false
    })
  })

  it(`should return state with an error and cancel card when playing invalid action`, () => {
    const card = startState.players[1].cards[0] // 1/start card
    const cardOptions = { newPiece: true }

    const state = playCard({playerId: 1, card, cardOptions}, startState)

    expect(state.error).toEqual(
      `Can't remove a blocking piece from the board`,
      'Action should be invalid because of a blocking piece')
    expect(state.pieces).toEqual(startState.pieces)
    expect(state.players).toEqual(startState.players)
  })

  it(`should return state with an error and cancel card when playing a card not in the player's hand`, () => {
    const card = {value: 10, action: 'START', color: 'yellow'}
    const cardOptions = { newPiece: true }

    const state = playCard({playerId: 1, card, cardOptions}, startState)

    expect(state.error).toEqual(`Could not play card absent from player's hand`)
    expect(state.pieces).toEqual(startState.pieces)
    expect(state.players).toEqual(startState.players)
  })
})
