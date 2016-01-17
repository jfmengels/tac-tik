import _ from 'lodash/fp'
import expect from 'expect'

import reducer from './'
import { applyTo } from './utils'
import distributeCards from './distributeCards'

const unique = _.flow(_.flatten, _.uniq)

describe('game - distributing cards', () => {
  let startState

  beforeEach(() => {
    startState = reducer(undefined, { type: '@@INIT' })
  })

  it('should be initialized with cards that are already dealt to the players', () => {
    expect(startState.cardsInDeck.length).toEqual(48 - 4 * 4)
    const allPlayerCards = startState.players.map(({cards}) => {
      expect(cards.length).toEqual(4)
      return cards
    })
    expect(unique(allPlayerCards).length).toEqual(16)
    expect(unique(allPlayerCards.concat(startState.cardsInDeck)).length).toEqual(48)
  })

  it('should deal 4 cards to every player and remove them from the deck', () => {
    const state = distributeCards(startState.cardsInDeck, startState)

    expect(state.cardsInDeck.length).toEqual(16)
    const allPlayerCards = state.players.map(({cards}) => {
      expect(cards.length).toEqual(4)
      return cards
    })
    expect(unique(allPlayerCards).length).toEqual(16)
    expect(unique(allPlayerCards.concat(state.cardsInDeck)).length).toEqual(32)
  })

  it('should deplete cardsInDeck at every call', () => {
    const removeCardsFromPlayersHand = applyTo('players', _.map(
      _.assign({cards: []})
    ))

    const tmpState = _.flow(
      distributeCards(startState.cardsInDeck),
      removeCardsFromPlayersHand
    )(startState)

    const state = distributeCards(tmpState.cardsInDeck, tmpState)

    expect(state.cardsInDeck.length).toEqual(0)
  })
})
