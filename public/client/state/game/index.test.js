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
    expect(state.players[0].id).to.equal(0)
    expect(state.players[1].id).to.equal(1)
    expect(state.players[2].id).to.equal(2)
    expect(state.players[3].id).to.equal(3)
  })

  it('should have initialized game parameters', () => {
    expect(state.parameters).to.be.an('object')
    expect(state.parameters.numberOfPlayers).to.equal(4)
    expect(state.parameters.distanceBetweenPlayers).to.equal(16)
  })

  it('should have players partnered with the player opposite from them', () => {
    expect(state.players[0].partnerId).to.equal(2)
    expect(state.players[1].partnerId).to.equal(3)
    expect(state.players[2].partnerId).to.equal(0)
    expect(state.players[3].partnerId).to.equal(1)
  })

  it('should have players with 4 pieces in stock', () => {
    expect(state.players[0].piecesInStock).to.equal(4)
    expect(state.players[1].piecesInStock).to.equal(4)
    expect(state.players[2].piecesInStock).to.equal(4)
    expect(state.players[3].piecesInStock).to.equal(4)
  })

  it('should have board with zero pieces on the board', () => {
    expect(state.pieces).to.be.an('array')
    expect(state.pieces.length).to.equal(0)
  })
})
