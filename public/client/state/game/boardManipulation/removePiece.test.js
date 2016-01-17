import { expect } from 'chai'

import removePiece from './removePiece'

describe('game - removing a piece', () => {
  let startState

  beforeEach(() => {
    startState = {
      pieces: [{
        pos: 12,
        player: 0,
        isBlocking: false
      }, {
        pos: 16,
        player: 1,
        isBlocking: true
      }],
      players: [
        {piecesInStock: 3},
        {piecesInStock: 3},
        {piecesInStock: 4},
        {piecesInStock: 4}
     ],
     error: null
    }
  })

  it('should not change state if no piece is at the given position', () => {
    const state = removePiece(2, startState)

    expect(state).to.equal(startState)
  })

  it('should create an error when attempting to remove a piece in a blocking position', () => {
    const state = removePiece(16, startState)

    expect(state.error).to.equal(`Can't remove a blocking piece from the board`)
    expect(state.pieces).to.equal(startState.pieces)
    expect(state.players).to.equal(startState.players)
  })

  it(`should remove piece from board and add it back to the owner's pieces when removing a non-blocking piece`, () => {
    const state = removePiece(12, startState)

    expect(state.pieces.length).to.equal(1)
    expect(state.pieces[0]).to.deep.equal(startState.pieces[1])
    expect(state.players).to.deep.equal([
      {piecesInStock: 4},
      {piecesInStock: 3},
      {piecesInStock: 4},
      {piecesInStock: 4}
    ])
    expect(state.error).to.equal(null)
  })
})
