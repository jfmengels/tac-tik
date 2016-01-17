import _ from 'lodash/fp'
import expect from 'expect'

import reducer from '../'
import putPieceOnBoard from './putPieceOnBoard'

describe('game - starting a piece', () => {
  let startState

  beforeEach(() => {
    startState = reducer(undefined, { type: '@@INIT' })
  })

  it('should put a new piece on the board and remove one from the stock', () => {
    const state = putPieceOnBoard(2, startState)
    expect(state.players[2].piecesInStock).toEqual(3)
    expect(state.pieces.length).toEqual(1)

    const piece = state.pieces[0]
    expect(piece.player).toEqual(2)
    expect(piece.isBlocking).toEqual(true)
    expect(piece.pos).toEqual(2 * 16)
    expect(piece.isAtDestination).toEqual(false)
  })

  it('should remove a piece if one is present at the starting position', () => {
    const tmpState = _.cloneDeep(putPieceOnBoard(2, startState))
    tmpState.pieces[0].pos = 0
    tmpState.pieces[0].isBlocking = false

    const state = putPieceOnBoard(0, tmpState)

    expect(state.players[2].piecesInStock).toEqual(4)
    expect(state.players[0].piecesInStock).toEqual(3)
    expect(state.pieces.length).toEqual(1)

    const piece = state.pieces[0]
    expect(piece.player).toEqual(0)
    expect(piece.isBlocking).toEqual(true)
    expect(piece.pos).toEqual(0)
    expect(piece.isAtDestination).toEqual(false)
  })

  it('should set an error if a blocking piece is already present', () => {
    const tmpState = putPieceOnBoard(2, startState)
    const state = putPieceOnBoard(2, tmpState)
    expect(state.error).toEqual(`Can't remove a blocking piece from the board`)
    expect(state.pieces.length).toEqual(1)
    expect(state.players[2].piecesInStock).toEqual(3)
  })
})
