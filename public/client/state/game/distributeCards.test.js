import _ from 'lodash'
import u from 'updeep'
import { expect } from 'chai'

import reducer, { distributeCards } from './'

describe('game - distributing cards', () => {
  let startState

  beforeEach(() => {
    startState = reducer(undefined, { type: '@@INIT' })
  })

  it('should deal 4 cards to every player and remove them from the deck', () => {
    const state = reducer(startState, distributeCards(startState.cardsInDeck))
    expect(state.cardsInDeck.length).to.equal(48 - 4 * 4)
    const allPlayerCards = state.players.map(({cards}) => {
      expect(cards.length).to.equal(4)
      return cards
    })
    expect(_.unique(_.flatten(allPlayerCards)).length).to.equal(16)
    expect(_.unique(_.flatten(allPlayerCards.concat(state.cardsInDeck))).length).to.equal(48)
  })

  it('should deplete cardsInDeck at every call', () => {
    const removeCardsUpdater = {
      players: (players) => {
        return players.map((player) => {
          return Object.assign({}, player, {cards: []})
        })
      }
    }
    const removeCardsFromAPlayersHand = (state) => u(removeCardsUpdater, state)

    let state = reducer(startState, distributeCards(startState.cardsInDeck))
    expect(state.cardsInDeck.length).to.equal(32)

    state = removeCardsFromAPlayersHand(state)
    state = reducer(state, distributeCards(state.cardsInDeck))
    expect(state.cardsInDeck.length).to.equal(16)

    state = removeCardsFromAPlayersHand(state)
    state = reducer(state, distributeCards(state.cardsInDeck))
    expect(state.cardsInDeck.length).to.equal(0)
  })
})
