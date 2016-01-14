import _ from 'lodash'
import u from 'updeep'
import { expect } from 'chai'

import reducer from './'
import distributeCards from './distributeCards'

describe('game - distributing cards', () => {
  let startState

  beforeEach(() => {
    startState = reducer(undefined, { type: '@@INIT' })
  })

  it('should be initialized with cards that are already dealt to the players', () => {
    expect(startState.cardsInDeck.length).to.equal(48 - 4 * 4)
    const allPlayerCards = startState.players.map(({cards}) => {
      expect(cards.length).to.equal(4)
      return cards
    })
    expect(_.uniq(_.flatten(allPlayerCards)).length).to.equal(16)
    expect(_.uniq(_.flatten(allPlayerCards.concat(startState.cardsInDeck))).length).to.equal(48)
  })

  it('should deal 4 cards to every player and remove them from the deck', () => {
    const state = distributeCards(startState.cardsInDeck, startState)

    expect(state.cardsInDeck.length).to.equal(16)
    const allPlayerCards = state.players.map(({cards}) => {
      expect(cards.length).to.equal(4)
      return cards
    })
    expect(_.uniq(_.flatten(allPlayerCards)).length).to.equal(16)
    expect(_.uniq(_.flatten(allPlayerCards.concat(state.cardsInDeck))).length).to.equal(32)
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

    let state = distributeCards(startState.cardsInDeck, startState)
    state = removeCardsFromAPlayersHand(state)
    state = distributeCards(state.cardsInDeck, state)

    expect(state.cardsInDeck.length).to.equal(0)
  })
})
