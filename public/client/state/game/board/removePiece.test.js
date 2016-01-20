import expect from 'expect'
import freeze from 'deep-freeze-node'

import removePiece from './removePiece'

describe('game - removing a piece', () => {
  const setup = () => {
    return freeze({
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
    })
  }

  it('should not change state if no piece is at the given position', () => {
    const startState = setup()

    const state = removePiece(2, startState)

    expect(state).toEqual(startState)
  })

  it('should create an error when attempting to remove a piece in a blocking position', () => {
    const startState = setup()

    const state = removePiece(16, startState)

    expect(state.error).toEqual(`Can't remove a blocking piece from the board`)
    expect(state.pieces).toEqual(startState.pieces)
    expect(state.players).toEqual(startState.players)
  })

  it(`should remove piece from board and add it back to the owner's pieces when removing a non-blocking piece`, () => {
    const startState = setup()

    const state = removePiece(12, startState)

    expect(state.pieces.length).toEqual(1)
    expect(state.pieces[0]).toEqual(startState.pieces[1])
    expect(state.players).toEqual([
      {piecesInStock: 4},
      {piecesInStock: 3},
      {piecesInStock: 4},
      {piecesInStock: 4}
    ])
    expect(state.error).toEqual(null)
  })
})
