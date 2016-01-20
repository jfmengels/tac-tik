import expect from 'expect'
import freeze from 'deep-freeze-node'

import exchangePieces from './exchangePieces'

describe('game - exchanging pieces', () => {
  const setup = () => {
    return freeze({
      pieces: [{
        pos: 0,
        player: 0,
        isBlocking: true
      }, {
        pos: 10,
        player: 0,
        isBlocking: false
      }, {
        pos: 48,
        player: 1,
        isBlocking: false
      }],
      players: [
        {piecesInStock: 2},
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

  it('should exchange the position of two pieces', () => {
    const startState = setup()

    const state = exchangePieces(0, 10, 48, startState)

    expect(state.pieces.length).toEqual(startState.pieces.length)
    expect(state.pieces[1].pos).toEqual(48)
    expect(state.pieces[1].player).toEqual(0)
    expect(state.pieces[2].pos).toEqual(10)
    expect(state.pieces[2].player).toEqual(1)
  })

  it(`should set player's own piece (first) as non-blocking`, () => {
    const startState = setup()

    const state = exchangePieces(0, 0, 48, startState)

    expect(state.pieces.length).toEqual(startState.pieces.length)
    expect(state.pieces[0].isBlocking).toEqual(false)
    expect(state.pieces[0].pos).toEqual(48)
    expect(state.pieces[0].player).toEqual(0)
    expect(state.pieces[2].pos).toEqual(0)
    expect(state.pieces[2].player).toEqual(1)
  })

  it(`should set player's own piece (second) as non-blocking`, () => {
    const startState = setup()

    const state = exchangePieces(0, 48, 0, startState)

    expect(state.pieces.length).toEqual(startState.pieces.length)
    expect(state.pieces[0].isBlocking).toEqual(false)
    expect(state.pieces[0].pos).toEqual(48)
    expect(state.pieces[0].player).toEqual(0)
    expect(state.pieces[2].pos).toEqual(0)
    expect(state.pieces[2].player).toEqual(1)
  })

  it('should set second piece as non-blocking if it is from the same player as the first one', () => {
    const startState = setup()

    const state = exchangePieces(0, 10, 0, startState)

    expect(state.pieces.length).toEqual(startState.pieces.length)
    expect(state.pieces[0].isBlocking).toEqual(false)
    expect(state.pieces[0].pos).toEqual(10)
    expect(state.pieces[0].player).toEqual(0)
    expect(state.pieces[1].pos).toEqual(0)
    expect(state.pieces[1].player).toEqual(0)
  })

  it('should set an error when second piece is blocking and from a different player', () => {
    const startState = setup()

    const stateCase1 = exchangePieces(1, 48, 0, startState)
    const stateCase2 = exchangePieces(1, 0, 48, startState)

    expect(stateCase1.error).toEqual(`Can't exchange with a blocking piece from an other player`)
    expect(stateCase1.pieces).toEqual(startState.pieces)
    expect(stateCase2.error).toEqual(`Can't exchange with a blocking piece from an other player`)
    expect(stateCase2.pieces).toEqual(startState.pieces)
  })

  it('should set an error when none of the pieces are from the current player', () => {
    const startState = setup()

    const state = exchangePieces(1, 0, 10, startState)

    expect(state.error).toEqual(`Can't exchange two pieces that are not your own`)
    expect(state.pieces).toEqual(startState.pieces)
  })

  it('should set an error if one of the pieces is not found', () => {
    const startState = setup()

    const stateCase1 = exchangePieces(0, 0, 25, startState)
    const stateCase2 = exchangePieces(0, 25, 0, startState)

    expect(stateCase1.error).toEqual(`Could not find one of the pieces`)
    expect(stateCase1.pieces).toEqual(startState.pieces)
    expect(stateCase2.error).toEqual(`Could not find one of the pieces`)
    expect(stateCase2.pieces).toEqual(startState.pieces)
  })
})
