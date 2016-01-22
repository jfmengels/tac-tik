import _ from 'lodash/fp'
import expect from 'expect'
import freeze from 'deep-freeze-node'

import exchangeCards from './exchangeCards'

describe('game - exchanging cards', () => {
  const setup = () => {
    const startState = freeze({
      players: [{
        id: 0,
        partnerId: 2,
        cards: [
          {value: 10, action: 'START', color: 'blue'},
          {value: 10, action: 'START', color: 'green'},
          {value: 10, action: 'START', color: 'red'},
          {value: 8, action: 'MOVE', color: 'blue'}
        ]
      }, {
        id: 1,
        partnerId: 3,
        cards: [
          {value: 1, action: 'START', color: 'red'},
          {value: 'PERMUTE', action: 'PERMUTE', color: 'red'},
          {value: 7, action: 'MULTI', color: 'red'},
          {value: 6, action: 'MOVE', color: 'blue'}
        ]
      }, {
        id: 2,
        partnerId: 0,
        cards: [
          {value: 3, action: 'MOVE', color: 'red'},
          {value: 3, action: 'MOVE', color: 'blue'},
          {value: 3, action: 'MOVE', color: 'green'},
          {value: 3, action: 'MOVE', color: 'yellow'}
        ]
      }, {
        id: 3,
        partnerId: 1,
        cards: [
          {value: 5, action: 'MOVE', color: 'red'},
          {value: 5, action: 'MOVE', color: 'blue'},
          {value: 5, action: 'MOVE', color: 'green'},
          {value: 5, action: 'MOVE', color: 'yellow'}
        ]
      }],
      error: null
    })
    const card1 = { playerId: 0, card: startState.players[0].cards[1] }
    const card2 = { playerId: 2, card: startState.players[2].cards[0] }

    return { startState, card1, card2 }
  }

  it(`should swap two cards from player's hands`, () => {
    const { startState, card1, card2 } = setup()
    const sort = _.sortBy(['value', 'action', 'color'])

    const state = exchangeCards(card1, card2, startState)

    expect(state.error).toEqual(null)
    expect(sort(state.players[0].cards)).toEqual(sort([
      {value: 10, action: 'START', color: 'blue'},
      {value: 10, action: 'START', color: 'red'},
      {value: 8, action: 'MOVE', color: 'blue'},
      {value: 3, action: 'MOVE', color: 'red'}
    ]))
    expect(sort(state.players[2].cards)).toEqual(sort([
      {value: 10, action: 'START', color: 'green'},
      {value: 3, action: 'MOVE', color: 'blue'},
      {value: 3, action: 'MOVE', color: 'green'},
      {value: 3, action: 'MOVE', color: 'yellow'}
    ]))
  })

  it(`should set an error when exchanging cards between players who are not partners`, () => {
    const { startState, card1 } = setup()
    const card2 = { playerId: 1, card: startState.players[1].cards[0] }

    const state1 = exchangeCards(card1, card2, startState)
    const state2 = exchangeCards(card2, card1, startState)

    expect(state1.error).toEqual(`Can't exchange cards between two players who are not partners`)
    expect(state1.players).toEqual(startState.players)
    expect(state2.error).toEqual(`Can't exchange cards between two players who are not partners`)
    expect(state2.players).toEqual(startState.players)
  })

  it(`should set an error if a card is not in a player's hand`, () => {
    const { startState, card1 } = setup()
    const card2 = { playerId: 2, card: startState.players[3].cards[0] }

    const state1 = exchangeCards(card1, card2, startState)
    const state2 = exchangeCards(card2, card1, startState)

    expect(state1.error).toEqual(`Could not find card in player's hand`)
    expect(state1.players).toEqual(startState.players)
    expect(state2.error).toEqual(`Could not find card in player's hand`)
    expect(state2.players).toEqual(startState.players)
  })

  it(`should be curried`, () => {
    const { startState, card1, card2 } = setup()

    const state1 = exchangeCards(card1, card2, startState)
    const state2 = exchangeCards(card1, card2)(startState)
    const state3 = exchangeCards(card1)(card2)(startState)

    expect(state1).toEqual(state2)
    expect(state1).toEqual(state3)
  })
})
