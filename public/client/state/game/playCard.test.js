import _ from 'lodash'
import { expect } from 'chai'

import reducer, { playCard } from './'

describe('game - playing a card', () => {
  let startState

  beforeEach(() => {
    startState = reducer(undefined, { type: '@@INIT' })
  })

  it(`should remove the played card from the player's hand (first played card)`, () => {
    const previousCards = startState.players[2].cards
    expect(previousCards.length).to.equal(4)

    const state = reducer(startState, playCard(2, previousCards[3]))
    const newCards = state.players[2].cards

    expect(newCards.length).to.equal(3)
    expect(_.find(newCards, previousCards[3])).to.equal(undefined)
    expect(newCards.concat(previousCards[3]), 'value')
      .to.deep.equal(previousCards, 'value')
  })

  it(`should remove the played card from the player's hand (second played card)`, () => {
    const tmpState = reducer(startState, playCard(2, startState.players[2].cards[3]))
    const previousCards = tmpState.players[2].cards

    const state = reducer(tmpState, playCard(2, previousCards[2]))
    const newCards = state.players[2].cards

    expect(newCards.length).to.equal(2)
    expect(_.find(newCards, previousCards[2])).to.equal(undefined)
    expect(newCards.concat(previousCards[2]), 'value')
      .to.deep.equal(previousCards, 'value')
  })
})
