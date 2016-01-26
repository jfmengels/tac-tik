import _ from 'lodash/fp'
import expect from 'expect'
import freeze from 'deep-freeze-node'

import { update } from '../fp-utils'
import distributeCards from './distributeCards'

const unique = _.flow(_.flatten, _.uniq)

describe('game - distributing cards', () => {
  const setup = () => {
    const cardsInDeck = freeze([
      { value: 1, action: 'START', color: 'blue' },
      { value: -4, action: 'MOVE', color: 'green' },
      { value: 6, action: 'MOVE', color: 'yellow' },
      { value: 6, action: 'MOVE', color: 'green' },
      { value: 2, action: 'MOVE', color: 'blue' },
      { value: 6, action: 'MOVE', color: 'red' },
      { value: 'PERMUTE', action: 'PERMUTE', color: 'green' },
      { value: -4, action: 'MOVE', color: 'blue' },
      { value: 'PERMUTE', action: 'PERMUTE', color: 'yellow' },
      { value: 7, action: 'MULTI', color: 'yellow' },
      { value: 2, action: 'MOVE', color: 'red' },
      { value: 3, action: 'MOVE', color: 'green' },
      { value: 9, action: 'MOVE', color: 'yellow' },
      { value: 10, action: 'START', color: 'red' },
      { value: 10, action: 'START', color: 'blue' },
      { value: 1, action: 'START', color: 'yellow' },
      { value: 8, action: 'MOVE', color: 'blue' },
      { value: 8, action: 'MOVE', color: 'yellow' },
      { value: 3, action: 'MOVE', color: 'red' },
      { value: 10, action: 'START', color: 'yellow' },
      { value: 6, action: 'MOVE', color: 'blue' },
      { value: 5, action: 'MOVE', color: 'blue' },
      { value: 1, action: 'START', color: 'green' },
      { value: 2, action: 'MOVE', color: 'green' },
      { value: 5, action: 'MOVE', color: 'green' },
      { value: 7, action: 'MULTI', color: 'green' },
      { value: -4, action: 'MOVE', color: 'yellow' },
      { value: 9, action: 'MOVE', color: 'red' },
      { value: -4, action: 'MOVE', color: 'red' },
      { value: 12, action: 'MOVE', color: 'yellow' },
      { value: 3, action: 'MOVE', color: 'yellow' },
      { value: 12, action: 'MOVE', color: 'blue' },
      { value: 7, action: 'MULTI', color: 'red' },
      { value: 'PERMUTE', action: 'PERMUTE', color: 'blue' },
      { value: 5, action: 'MOVE', color: 'yellow' },
      { value: 10, action: 'START', color: 'green' },
      { value: 9, action: 'MOVE', color: 'blue' },
      { value: 12, action: 'MOVE', color: 'green' },
      { value: 9, action: 'MOVE', color: 'green' },
      { value: 7, action: 'MULTI', color: 'blue' },
      { value: 12, action: 'MOVE', color: 'red' },
      { value: 8, action: 'MOVE', color: 'red' },
      { value: 2, action: 'MOVE', color: 'yellow' },
      { value: 'PERMUTE', action: 'PERMUTE', color: 'red' },
      { value: 5, action: 'MOVE', color: 'red' },
      { value: 3, action: 'MOVE', color: 'blue' },
      { value: 1, action: 'START', color: 'red' },
      { value: 8, action: 'MOVE', color: 'green' }
    ])

    const newDeck = freeze([
      { value: 3, action: 'MOVE', color: 'blue' },
      { value: 5, action: 'MOVE', color: 'yellow' },
      { value: 6, action: 'MOVE', color: 'blue' },
      { value: -4, action: 'MOVE', color: 'green' },
      { value: 1, action: 'START', color: 'red' },
      { value: 1, action: 'START', color: 'blue' },
      { value: 6, action: 'MOVE', color: 'yellow' },
      { value: 12, action: 'MOVE', color: 'red' },
      { value: 2, action: 'MOVE', color: 'yellow' },
      { value: 3, action: 'MOVE', color: 'green' },
      { value: 5, action: 'MOVE', color: 'blue' },
      { value: 1, action: 'START', color: 'green' },
      { value: 'PERMUTE', action: 'PERMUTE', color: 'yellow' },
      { value: 8, action: 'MOVE', color: 'blue' },
      { value: 9, action: 'MOVE', color: 'green' },
      { value: 'PERMUTE', action: 'PERMUTE', color: 'green' },
      { value: 7, action: 'MULTI', color: 'yellow' },
      { value: 3, action: 'MOVE', color: 'yellow' },
      { value: 7, action: 'MULTI', color: 'blue' },
      { value: -4, action: 'MOVE', color: 'red' },
      { value: 5, action: 'MOVE', color: 'green' },
      { value: 10, action: 'START', color: 'yellow' },
      { value: 2, action: 'MOVE', color: 'red' },
      { value: 12, action: 'MOVE', color: 'blue' },
      { value: 2, action: 'MOVE', color: 'blue' },
      { value: 8, action: 'MOVE', color: 'red' },
      { value: 1, action: 'START', color: 'yellow' },
      { value: 8, action: 'MOVE', color: 'green' },
      { value: 12, action: 'MOVE', color: 'green' },
      { value: 9, action: 'MOVE', color: 'red' },
      { value: 7, action: 'MULTI', color: 'red' },
      { value: 9, action: 'MOVE', color: 'yellow' },
      { value: 3, action: 'MOVE', color: 'red' },
      { value: 6, action: 'MOVE', color: 'green' },
      { value: 10, action: 'START', color: 'red' },
      { value: 5, action: 'MOVE', color: 'red' },
      { value: 12, action: 'MOVE', color: 'yellow' },
      { value: 8, action: 'MOVE', color: 'yellow' },
      { value: 10, action: 'START', color: 'blue' },
      { value: 'PERMUTE', action: 'PERMUTE', color: 'blue' },
      { value: -4, action: 'MOVE', color: 'yellow' },
      { value: -4, action: 'MOVE', color: 'blue' },
      { value: 6, action: 'MOVE', color: 'red' },
      { value: 9, action: 'MOVE', color: 'blue' },
      { value: 2, action: 'MOVE', color: 'green' },
      { value: 7, action: 'MULTI', color: 'green' },
      { value: 10, action: 'START', color: 'green' },
      { value: 'PERMUTE', action: 'PERMUTE', color: 'red' }
    ])

    return {
      newDeck,
      startState: freeze({
        cardsInDeck,
        players: [
          {cards: []},
          {cards: []},
          {cards: []},
          {cards: []}
        ],
        parameters: {
          numberOfPlayers: 4
        }
      })
    }
  }

  it('should deal 4 cards to every player and remove them from the deck', () => {
    const { startState } = setup()

    const state = distributeCards(startState.cardsInDeck, startState)

    expect(state.cardsInDeck.length).toEqual(32)
    const allPlayerCards = state.players.map(({cards}) => {
      expect(cards.length).toEqual(4)
      return cards
    })
    expect(unique(allPlayerCards).length).toEqual(16)
    expect(unique(allPlayerCards.concat(state.cardsInDeck)).length).toEqual(48)
  })

  it('should deplete cardsInDeck at every call', () => {
    const { startState, newDeck } = setup()

    const removeCardsFromPlayersHand = update('players', _.map(
      _.set('cards', [])
    ))

    const state1 = distributeCards(startState.cardsInDeck, startState)
    const state2 = distributeCards(state1.cardsInDeck, removeCardsFromPlayersHand(state1))
    const state3 = distributeCards(state2.cardsInDeck, removeCardsFromPlayersHand(state2))
    const state4 = distributeCards(newDeck, removeCardsFromPlayersHand(state3))

    expect(state1.cardsInDeck.length).toEqual(32)
    expect(state2.cardsInDeck.length).toEqual(16)
    expect(state3.cardsInDeck.length).toEqual(0)
    expect(state4.cardsInDeck.length).toEqual(32)
  })
})
