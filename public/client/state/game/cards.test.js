import _ from 'lodash'
import { expect } from 'chai'

import createNewDeck from './cards'

describe('game - cards shuffling', () => {
  it('should return the whole deck', () => {
    const cards = createNewDeck()

    expect(cards).to.be.an('array')
    expect(cards.length).to.equal(48)

    expect(_.filter(cards, {color: 'red'}).length).to.equal(12)
    expect(_.filter(cards, {color: 'blue'}).length).to.equal(12)
    expect(_.filter(cards, {color: 'green'}).length).to.equal(12)
    expect(_.filter(cards, {color: 'yellow'}).length).to.equal(12)

    expect(_.filter(cards, {value: 1, action: 'START'}).length).to.equal(4)
    expect(_.filter(cards, {value: 2, action: 'MOVE'}).length).to.equal(4)
    expect(_.filter(cards, {value: 3, action: 'MOVE'}).length).to.equal(4)
    expect(_.filter(cards, {value: -4, action: 'MOVE'}).length).to.equal(4)
    expect(_.filter(cards, {value: 5, action: 'MOVE'}).length).to.equal(4)
    expect(_.filter(cards, {value: 6, action: 'MOVE'}).length).to.equal(4)
    expect(_.filter(cards, {value: 7, action: 'MULTI'}).length).to.equal(4)
    expect(_.filter(cards, {value: 8, action: 'MOVE'}).length).to.equal(4)
    expect(_.filter(cards, {value: 9, action: 'MOVE'}).length).to.equal(4)
    expect(_.filter(cards, {value: 10, action: 'START'}).length).to.equal(4)
    expect(_.filter(cards, {value: 'PERMUTE', action: 'PERMUTE'}).length).to.equal(4)
    expect(_.filter(cards, {value: 12, action: 'MOVE'}).length).to.equal(4)

    // All cards should be unique
    expect(_.unique(cards).length).to.equal(48)
  })

  it('should have the deck be shuffled at every call', () => {
    expect(createNewDeck()).to.not.deep.equal(createNewDeck())
  })
})
