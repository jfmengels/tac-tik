import _ from 'lodash'
import { expect } from 'chai'

import reducer from './'

describe('game - initialization', () => {
  let state

  beforeEach(() => {
    state = reducer(undefined, { type: '@@INIT' })
  })

  it('should have initialized 4 players', () => {
    expect(state.players).to.be.an('array')
    expect(state.players.length).to.equal(4)

    const playerIds = state.players.map(({id}) => id)
    expect(_.sortBy(playerIds)).to.deep.equal([0, 1, 2, 3])
  })

  it('should have players properly properly associated', () => {
    const partners = {
      0: 2,
      1: 3,
      2: 0,
      3: 1
    }

    state.players.forEach(({id, partnerId}) => {
      expect(partnerId).to.equal(partners[id])
    })
  })

  it('should have players with 4 pieces in stock', () => {
    state.players.forEach(({piecesInStock}) => {
      expect(piecesInStock).to.equal(4)
    })
  })

  it('should have no pieces on the board', () => {
    expect(state.pieces).to.be.an('array')
    expect(state.pieces.length).to.equal(0)
  })
})
