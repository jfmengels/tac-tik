import _ from 'lodash/fp'
import { expect } from 'chai'

import createNewDeck from './cards'

describe('game - cards shuffling', () => {
  it('should return the whole deck', () => {
    const cards = createNewDeck()

    expect(cards).to.be.an('array')
    expect(cards.length).to.equal(48)

    expect(_.filter({color: 'red'}, cards).length).to.equal(12)
    expect(_.filter({color: 'blue'}, cards).length).to.equal(12)
    expect(_.filter({color: 'green'}, cards).length).to.equal(12)
    expect(_.filter({color: 'yellow'}, cards).length).to.equal(12)

    expect(_.filter({value: 1, action: 'START'}, cards).length).to.equal(4)
    expect(_.filter({value: 2, action: 'MOVE'}, cards).length).to.equal(4)
    expect(_.filter({value: 3, action: 'MOVE'}, cards).length).to.equal(4)
    expect(_.filter({value: -4, action: 'MOVE'}, cards).length).to.equal(4)
    expect(_.filter({value: 5, action: 'MOVE'}, cards).length).to.equal(4)
    expect(_.filter({value: 6, action: 'MOVE'}, cards).length).to.equal(4)
    expect(_.filter({value: 7, action: 'MULTI'}, cards).length).to.equal(4)
    expect(_.filter({value: 8, action: 'MOVE'}, cards).length).to.equal(4)
    expect(_.filter({value: 9, action: 'MOVE'}, cards).length).to.equal(4)
    expect(_.filter({value: 10, action: 'START'}, cards).length).to.equal(4)
    expect(_.filter({value: 'PERMUTE', action: 'PERMUTE'}, cards).length).to.equal(4)
    expect(_.filter({value: 12, action: 'MOVE'}, cards).length).to.equal(4)

    // All cards should be unique
    expect(_.uniq(cards).length).to.equal(48)
  })

  it('should have the deck be shuffled at every call', () => {
    expect(createNewDeck()).to.not.deep.equal(createNewDeck())
  })
})
