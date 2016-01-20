import _ from 'lodash/fp'
import expect from 'expect'
import freeze from 'deep-freeze-node'

import movePiece from './movePiece'

describe('game - moving a piece', () => {
  const setup = () => {
    return freeze({
      pieces: [{
        pos: 32,
        player: 2,
        isBlocking: true
      }, {
        pos: 3,
        player: 0,
        isBlocking: false
      }, {
        pos: 8,
        player: 1,
        isBlocking: false
      }, {
        pos: 16,
        player: 1,
        isBlocking: true
      }],
      players: [
        {piecesInStock: 3},
        {piecesInStock: 2},
        {piecesInStock: 3},
        {piecesInStock: 4}
      ],
      parameters: {
        distanceBetweenPlayers: 16,
        numberOfPlayers: 4
      },
      error: null
    })
  }

  it('should be able to move a piece forward and set it as non-blocking', () => {
    const startState = setup()

    const state = movePiece(2, 32, 5, startState)

    expect(state.error).toEqual(null)
    expect(state.pieces[0].pos).toEqual(37)
    expect(state.pieces[0].isBlocking).toEqual(false)
  })

  it('should not re-set non-blocking piece to blocking', () => {
    const startState = _.flow(
      _.set(37, ['pieces', 0, 'pos']),
      _.set(false, ['pieces', 0, 'blocking']),
      freeze
    )(setup())

    const state = movePiece(2, 37, 8, startState)

    expect(state.pieces[0].pos).toEqual(45)
    expect(state.pieces[0].isBlocking).toEqual(false)
  })

  it('should be able to loop over the board', () => {
    const startState = setup()

    const state = movePiece(2, 32, 41, startState)

    expect(state.pieces[0].pos).toEqual(9)
  })

  it('should not remove non-blocking pieces that are walked passed over', () => {
    const startState = setup()

    const state = movePiece(0, 3, 9, startState)

    expect(state.pieces[1].pos).toEqual(12)
    expect(state.pieces.length).toEqual(startState.pieces.length)
  })

  it('should remove a non-blocking piece that is at the destination', () => {
    const startState = setup()

    const state = movePiece(0, 3, 5, startState)

    expect(state.pieces.length).toEqual(startState.pieces.length - 1)
    expect(state.pieces[1].pos).toEqual(8)
    expect(state.pieces[1].player).toEqual(0)
    expect(state.players[1].piecesInStock).toEqual(startState.players[1].piecesInStock + 1)
  })

  it('should set an error if a blocking piece is at the destination', () => {
    const startState = setup()

    const state = movePiece(0, 3, 13, startState)

    expect(state.error).toEqual(`Can't remove a blocking piece from the board`)
    expect(state.pieces).toEqual(startState.pieces)
    expect(state.players).toEqual(startState.players)
  })

  it('should set an error if a blocking piece is on the path (not looping the board)', () => {
    const startState = setup()

    const state = movePiece(0, 3, 16, startState)

    expect(state.error).toEqual(`Can't remove a blocking piece from the board`)
    expect(state.pieces).toEqual(startState.pieces)
    expect(state.players).toEqual(startState.players)
  })

  it('should set an error if a blocking piece is at destination (looping the board)', () => {
    const startState = setup()

    const state = movePiece(1, 16, 16, startState)

    expect(state.error).toEqual(`Can't remove a blocking piece from the board`)
    expect(state.pieces).toEqual(startState.pieces)
    expect(state.players).toEqual(startState.players)
  })

  it('should set an error when moving a piece from another player', () => {
    const startState = setup()

    const state = movePiece(3, 16, 16, startState)

    expect(state.error).toEqual(`Can't move a piece from another player`)
    expect(state.pieces).toEqual(startState.pieces)
    expect(state.players).toEqual(startState.players)
  })

  it('should set an error when moving a piece from a position where there is none', () => {
    const startState = setup()

    const state = movePiece(0, 1, 2, startState)

    expect(state.error).toEqual(`There is no piece at the given position`)
    expect(state.pieces).toEqual(startState.pieces)
    expect(state.players).toEqual(startState.players)
  })
})
