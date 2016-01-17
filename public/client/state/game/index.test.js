import _ from 'lodash/fp'
import expect from 'expect'

import reducer from './'

describe('game - initialization', () => {
  let state

  beforeEach(() => {
    state = reducer(undefined, { type: '@@INIT' })
  })

  it('should have initialized 4 players', () => {
    expect(state.players).toBeA('array')
    expect(state.players.length).toEqual(4)
    expect(state.players[0].id).toEqual(0)
    expect(state.players[1].id).toEqual(1)
    expect(state.players[2].id).toEqual(2)
    expect(state.players[3].id).toEqual(3)
  })

  it('should have initialized game parameters', () => {
    expect(state.parameters).toBeA('object')
    expect(state.parameters.numberOfPlayers).toEqual(4)
    expect(state.parameters.distanceBetweenPlayers).toEqual(16)
  })

  it('should have players partnered with the player opposite from them', () => {
    expect(state.players[0].partnerId).toEqual(2)
    expect(state.players[1].partnerId).toEqual(3)
    expect(state.players[2].partnerId).toEqual(0)
    expect(state.players[3].partnerId).toEqual(1)
  })

  it('should have players with 4 pieces in stock', () => {
    expect(state.players[0].piecesInStock).toEqual(4)
    expect(state.players[1].piecesInStock).toEqual(4)
    expect(state.players[2].piecesInStock).toEqual(4)
    expect(state.players[3].piecesInStock).toEqual(4)
  })

  it('should have board with zero pieces on the board', () => {
    expect(state.pieces).toBeA('array')
    expect(state.pieces.length).toEqual(0)
  })

  it(`should have 4 cards in every player's hand`, () => {
    expect(state.players[0].cards.length).toEqual(4)
    expect(state.players[1].cards.length).toEqual(4)
    expect(state.players[2].cards.length).toEqual(4)
    expect(state.players[3].cards.length).toEqual(4)
  })

  it('should have 32 cards left in deck', () => {
    expect(state.cardsInDeck.length).toEqual(32)
  })

  it('should only have unique cards in game', () => {
    const unique = _.flow(_.flatten, _.uniq)

    const allPlayerCards = state.players.map(({cards}) => {
      expect(cards.length).toEqual(4)
      return cards
    })
    expect(unique(allPlayerCards).length).toEqual(16)
    expect(unique(allPlayerCards.concat(state.cardsInDeck)).length).toEqual(48)
  })
})
