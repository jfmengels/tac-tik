import _ from 'lodash/fp'
import expect from 'expect'
import freeze from 'deep-freeze-node'

import playCard from './playCard'

describe('game - playing a card', () => {
  const setup = () => freeze({
    pieces: [{
      pos: 2,
      player: 0,
      isBlocking: false,
      isHome: false
    }, {
      pos: 16,
      player: 1,
      isBlocking: true,
      isHome: false
    }, {
      pos: 34,
      player: 1,
      isBlocking: false,
      isHome: false
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
        piecesInStock: 2,
        cards: [
          {value: 1, action: 'START', color: 'red'},
          {value: 'PERMUTE', action: 'PERMUTE', color: 'red'},
          {value: 7, action: 'MULTI', color: 'red'},
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
  })

  it(`should remove the played card from the player's hand`, () => {
    const startState = setup()
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

  it(`should put a piece on the board with a 'start' card`, () => {
    const startState = setup()
    const previousCards = startState.players[0].cards
    const card = previousCards[1]
    const cardOptions = { newPiece: true }

    const state = playCard({playerId: 0, card, cardOptions}, startState)

    expect(state.error).toEqual(null)
    expect(state.players[0].piecesInStock).toEqual(2)
    expect(state.pieces.length).toEqual(4)
    expect(state.pieces[3]).toEqual({
      pos: 0,
      player: 0,
      isBlocking: true,
      isHome: false
    })
  })

  it(`should move a piece on the board with a 'move' card`, () => {
    const startState = setup()
    const card = startState.players[0].cards[0] // 10/start card
    const cardOptions = { newPiece: false, pos: 2 }

    const state = playCard({playerId: 0, card, cardOptions}, startState)

    expect(state.error).toEqual(null)
    expect(state.players[0].piecesInStock).toEqual(3)
    expect(state.pieces.length).toEqual(3)
    expect(state.pieces[0]).toEqual({
      pos: 12,
      player: 0,
      isBlocking: false,
      isHome: false
    })
  })

  it(`should move a piece on the board with a 'move' card`, () => {
    const startState = setup()
    const card = startState.players[0].cards[3] // 8/move card
    const cardOptions = { pos: 2 }

    const state = playCard({playerId: 0, card, cardOptions}, startState)

    expect(state.error).toEqual(null)
    expect(state.pieces[0]).toEqual({
      pos: 10,
      player: 0,
      isBlocking: false,
      isHome: false
    })
  })

  it(`should exchange the positions of two pieces on the board with a 'permute' card`, () => {
    const startState = setup()
    const card = startState.players[1].cards[1] // PERMUTE card
    const cardOptions = { pos: [2, 16] }

    const state = playCard({playerId: 1, card, cardOptions}, startState)

    expect(state.error).toEqual(null)
    expect(state.pieces[0]).toEqual({
      pos: 16,
      player: 0,
      isBlocking: false,
      isHome: false
    })
    expect(state.pieces[1]).toEqual({
      pos: 2,
      player: 1,
      isBlocking: false,
      isHome: false
    })
  })

  it(`should move multiple pieces on the board with a 'multi' card`, () => {
    const startState = setup()
    const card = startState.players[1].cards[2] // 7/multi card
    const cardOptions = {
      moves: [
        {pos: 16, steps: 4},
        {pos: 34, steps: 3}
      ]
    }

    const state = playCard({playerId: 1, card, cardOptions}, startState)

    expect(state.error).toEqual(null)
    expect(state.pieces[1]).toEqual({
      pos: 20,
      player: 1,
      isBlocking: false,
      isHome: false
    })
    expect(state.pieces[2]).toEqual({
      pos: 37,
      player: 1,
      isBlocking: false,
      isHome: false
    })
  })

  it(`should set an error when total number of steps is higher than 'multi' card value`, () => {
    const startState = setup()
    const card = startState.players[1].cards[2] // 7/multi card
    const cardOptions = {
      moves: [
        {pos: 16, steps: 4},
        {pos: 34, steps: 4}
      ]
    }

    const state = playCard({playerId: 1, card, cardOptions}, startState)

    expect(state.error).toEqual(`Total number of steps does not equal the card value`)
    expect(state.pieces).toEqual(startState.pieces)
    expect(state.players).toEqual(startState.players)
  })

  it(`should set an error when total number of steps is lower than 'multi' card value`, () => {
    const startState = setup()
    const card = startState.players[1].cards[2] // 7/multi card
    const cardOptions = {
      moves: [
        {pos: 16, steps: 2},
        {pos: 34, steps: 3}
      ]
    }

    const state = playCard({playerId: 1, card, cardOptions}, startState)

    expect(state.error).toEqual(`Total number of steps does not equal the card value`)
    expect(state.pieces).toEqual(startState.pieces)
    expect(state.players).toEqual(startState.players)
  })

  it(`should set an error and cancel card when playing invalid action`, () => {
    const startState = setup()
    const card = startState.players[1].cards[0] // 1/start card
    const cardOptions = { newPiece: true }

    const state = playCard({playerId: 1, card, cardOptions}, startState)

    expect(state.error).toEqual(
      `Can't remove a blocking piece from the board`,
      'Action should be invalid because of a blocking piece')
    expect(state.pieces).toEqual(startState.pieces)
    expect(state.players).toEqual(startState.players)
  })

  it(`should set an error and cancel card when playing a card not in the player's hand`, () => {
    const startState = setup()
    const card = {value: 10, action: 'START', color: 'yellow'}
    const cardOptions = { newPiece: true }

    const state = playCard({playerId: 1, card, cardOptions}, startState)

    expect(state.error).toEqual(`Could not play card absent from player's hand`)
    expect(state.pieces).toEqual(startState.pieces)
    expect(state.players).toEqual(startState.players)
  })

  it(`should set an error when card action is unknown`, () => {
    const startState = _.flow(
      _.set(['players', 1, 'cards', 0, 'action'], 'UNKNOWN ACTION'),
      freeze
    )(setup())
    const card = startState.players[1].cards[0] // 1/start card
    const cardOptions = { newPiece: true }

    const state = playCard({playerId: 1, card, cardOptions}, startState)

    expect(state.error).toEqual('Unknown card action')
    expect(state.pieces).toEqual(startState.pieces)
    expect(state.players).toEqual(startState.players)
  })
})
