import _ from 'lodash/fp'
import expect from 'expect'
import freeze from 'deep-freeze-node'

import putPieceOnBoard from './putPieceOnBoard'

describe('game - starting a piece', () => {
  const setup = () => {
    return freeze({
      pieces: [{
        pos: 0,
        player: 0,
        isBlocking: true
      }, {
        pos: 48,
        player: 1,
        isBlocking: false
      }],
      players: [
        {piecesInStock: 3},
        {piecesInStock: 3},
        {piecesInStock: 4},
        {piecesInStock: 4}
      ],
      parameters: {
        distanceBetweenPlayers: 16,
        numberOfPlayers: 4
      },
      error: null
    })
  }

  it('should put a new piece on the board and remove one from the stock', () => {
    const startState = setup()

    const state = putPieceOnBoard(2, startState)

    expect(state.players[2].piecesInStock).toEqual(3)
    expect(state.pieces.length).toEqual(startState.pieces.length + 1)
    expect(state.pieces[2]).toEqual({
      pos: 32,
      player: 2,
      isBlocking: true,
      isHome: false
    })
  })

  it('should remove a piece if one is present at the starting position', () => {
    const startState = setup()

    const state = putPieceOnBoard(3, startState)

    expect(state.players[3].piecesInStock).toEqual(3)
    expect(state.players[1].piecesInStock).toEqual(4)
    expect(state.pieces.length).toEqual(startState.pieces.length)
    expect(state.pieces[1]).toEqual({
      pos: 48,
      player: 3,
      isBlocking: true,
      isHome: false
    })
  })

  it('should set an error if a blocking piece is already present', () => {
    const startState = setup()

    const state = putPieceOnBoard(0, startState)

    expect(state.error).toEqual(`Can't remove a blocking piece from the board`)
    expect(state.pieces).toEqual(startState.pieces)
    expect(state.players).toEqual(startState.players)
  })

  it('should set an error if the player has no more pieces in stock', () => {
    const startState = setup()
    const tmpState = freeze(_.set(['players', 3, 'piecesInStock'], 0, startState))

    const state = putPieceOnBoard(3, tmpState)

    expect(state.error).toEqual(`Can't put a new piece on the board because none are left in stock`)
    expect(state.pieces).toEqual(tmpState.pieces)
    expect(state.players).toEqual(tmpState.players)
  })
})
