import expect from 'expect'
import freeze from 'deep-freeze-node'

import multiMove from './multiMove'

describe('game - moving multiple pieces', () => {
  const setup = () => {
    return freeze({
      pieces: [{
        pos: 32,
        player: 2,
        isBlocking: true
      }, {
        pos: 7,
        player: 1,
        isBlocking: false
      }, {
        pos: 16,
        player: 1,
        isBlocking: true
      }, {
        pos: 3,
        player: 0,
        isBlocking: false
      }, {
        pos: 8,
        player: 3,
        isBlocking: false
      }, {
        pos: 11,
        player: 3,
        isBlocking: false
      }],
      players: [
        {piecesInStock: 3},
        {piecesInStock: 2},
        {piecesInStock: 3},
        {piecesInStock: 2}
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
    const moves = [
      {pos: 32, steps: 7}
    ]

    const state = multiMove(2, moves, startState)

    expect(state.error).toEqual(null)
    expect(state.pieces[0].pos).toEqual(39)
    expect(state.pieces[0].isBlocking).toEqual(false)
  })

  it('should be able to move several pieces', () => {
    const startState = setup()
    const moves = [
      {pos: 7, steps: 4},
      {pos: 16, steps: 3}
    ]

    const state = multiMove(1, moves, startState)

    expect(state.error).toEqual(null)
    expect(state.pieces[1].pos).toEqual(11)
    expect(state.pieces[1].isBlocking).toEqual(false)
    expect(state.pieces[2].pos).toEqual(19)
    expect(state.pieces[2].isBlocking).toEqual(false)
  })

  it('should remove all pieces on the path and at destination', () => {
    const startState = setup()
    const moves = [
      {pos: 7, steps: 4},
      {pos: 16, steps: 3}
    ]

    const state = multiMove(1, moves, startState)

    expect(state.error).toEqual(null)
    expect(state.pieces.length).toEqual(4)
    expect(state.players[3].piecesInStock).toEqual(4)
  })

  it('should be done in given order (piece gets removed)', () => {
    const startState = setup()
    const moves = [
      {pos: 8, steps: 3},
      {pos: 11, steps: 4}
    ]

    const state = multiMove(3, moves, startState)

    expect(state.error).toEqual(null)
    expect(state.pieces.length).toEqual(5)
    expect(state.pieces[4].pos).toEqual(15)
    expect(state.players[3].piecesInStock).toEqual(3)
  })

  it('should be done in given order (piece does not get removed)', () => {
    const startState = setup()
    const moves = [
      {pos: 11, steps: 4},
      {pos: 8, steps: 3}
    ]

    const state = multiMove(3, moves, startState)

    expect(state.error).toEqual(null)
    expect(state.pieces.length).toEqual(6)
    expect(state.pieces[4].pos).toEqual(11)
    expect(state.pieces[5].pos).toEqual(15)
    expect(state.players[3].piecesInStock).toEqual(2)
  })

  it('should set an error if attempting to move a piece from another player', () => {
    const startState = setup()
    const moves = [
      {pos: 32, steps: 7}
    ]

    const state = multiMove(0, moves, startState)

    expect(state.error).toEqual(`Can't move a piece from another player`)
    expect(state.pieces).toEqual(startState.pieces)
    expect(state.players).toEqual(startState.players)
  })

  it('should revert any changes before setting an error when attempting to move a piece from another player', () => {
    const startState = setup()
    const moves = [
      {pos: 32, steps: 4},
      {pos: 8, steps: 3}
    ]

    const state = multiMove(2, moves, startState)

    expect(state.error).toEqual(`Can't move a piece from another player`)
    expect(state.pieces).toEqual(startState.pieces)
    expect(state.players).toEqual(startState.players)
  })

  it('should set an error if one of the moves is invalid due to a blocking piece', () => {
    const startState = setup()
    const moves = [
      {pos: 8, steps: 2},
      {pos: 11, steps: 5}
    ]

    const state = multiMove(3, moves, startState)

    expect(state.error).toEqual(`Can't remove a blocking piece from the board`)
    expect(state.pieces).toEqual(startState.pieces)
    expect(state.players).toEqual(startState.players)
  })
})
