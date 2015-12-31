import _ from 'lodash'
import { expect } from 'chai'

import reducer, { playCard, distributeCards } from './'

describe('game - playing a card', () => {
  let startState

  beforeEach(() => {
    startState = reducer(undefined, { type: '@@INIT' })
  })

  it(`should remove the played card from the player's hand`, () => {
    const tmpState = reducer(startState, distributeCards(startState.cardsInDeck))

    const previousCards = tmpState.players[2].cards
    expect(previousCards.length).to.equal(4)

    const state1 = reducer(tmpState, playCard(2, previousCards[3]))
    const newCards1 = state1.players[2].cards
    expect(newCards1.length).to.equal(3)
    expect(_.find(newCards1, previousCards[3])).to.equal(undefined)
    expect(newCards1.concat(previousCards[3]), 'value')
      .to.deep.equal(previousCards, 'value')

    // Apply the same tests
    const state2 = reducer(state1, playCard(2, newCards1[2]))
    const newCards2 = state2.players[2].cards
    expect(newCards2.length).to.equal(2)
    expect(_.find(newCards2, newCards1[2])).to.equal(undefined)
    expect(newCards2.concat(newCards1[2]), 'value')
      .to.deep.equal(newCards1, 'value')
  })
})
