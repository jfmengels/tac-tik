import _ from 'lodash'
import { expect } from 'chai'

import reducer, { putPieceOnBoard, movePiece } from './'

describe('game - moving a piece', () => {
  let startState

  beforeEach(() => {
    startState = reducer(undefined, { type: '@@INIT' })
    startState = reducer(startState, putPieceOnBoard(2))
  })

  it('should be able to move a piece forward and set it as non-blocking', () => {
    const state = reducer(startState, movePiece(2 * 16, 5))
    expect(state.pieces[0].pos).to.equal(2 * 16 + 5)
    expect(state.pieces[0].isBlocking).to.equal(false)
  })

  it('should not re-set non-blocking piece to blocking', () => {
    const tmpState = reducer(startState, movePiece(2 * 16, 5))
    expect(tmpState.pieces[0].isBlocking).to.equal(false)

    const state = reducer(tmpState, movePiece(2 * 16 + 5, 8))
    expect(state.pieces[0].pos).to.equal(2 * 16 + 13)
    expect(state.pieces[0].isBlocking).to.equal(false)
  })

  it('should be able to loop over the board', () => {
    const state = reducer(startState, movePiece(2 * 16, 41))
    expect(state.pieces[0].pos).to.equal(9)
  })

  it('should not remove a non-blocking piece that is being passed over', () => {
    const tmpState = _.cloneDeep(reducer(startState, putPieceOnBoard(0)))
    tmpState.pieces[0].pos = 5
    tmpState.pieces[0].isBlocking = false

    const state = reducer(tmpState, movePiece(0, 9))
    expect(state.pieces.length).to.equal(2)
    expect(state.pieces.filter((p) => p.player === 0 && p.pos === 9).length).to.equal(1)
    expect(state.pieces.filter((p) => p.player === 2 && p.pos === 5).length).to.equal(1)
  })

  it('should remove a non-blocking piece that is at the destination', () => {
    const tmpState = _.cloneDeep(reducer(startState, putPieceOnBoard(0)))
    tmpState.pieces[0].pos = 5
    tmpState.pieces[0].isBlocking = false

    const state = reducer(tmpState, movePiece(0, 5))
    expect(state.pieces.length).to.equal(1)
    expect(state.pieces[0].pos).to.equal(5)
    expect(state.pieces[0].player).to.equal(0)
  })

  it('should set an error if a blocking piece is at the destination', () => {
    const tmpState = _.cloneDeep(reducer(startState, putPieceOnBoard(0)))
    const pos = 2 * 16 - 5
    tmpState.pieces[1].pos = pos
    tmpState.pieces[1].isBlocking = false

    const state = reducer(tmpState, movePiece(pos, 5))
    expect(state.pieces.filter((p) => p.player === 0 && p.pos === pos).length).to.equal(1)
    expect(state.pieces.filter((p) => p.player === 2 && p.pos === 2 * 16).length).to.equal(1)
    expect(state.pieces.length).to.equal(2)
    expect(state.error).to.equal(`Can't remove a blocking piece from the board`)
  })

  it('should set an error if a blocking piece is on the path (not looping the board)', () => {
    const tmpState = _.cloneDeep(reducer(startState, putPieceOnBoard(0)))
    const pos = 2 * 16 - 3
    tmpState.pieces[1].pos = pos
    tmpState.pieces[1].isBlocking = false

    const state = reducer(tmpState, movePiece(pos, 5))
    expect(state.pieces.filter((p) => p.player === 0 && p.pos === pos).length).to.equal(1)
    expect(state.pieces.filter((p) => p.player === 2 && p.pos === 2 * 16).length).to.equal(1)
    expect(state.pieces.length).to.equal(2)
    expect(state.error).to.equal(`Can't remove a blocking piece from the board`)
  })

  it('should set an error if a blocking piece is at destination (looping the board)', () => {
    const tmpState = _.cloneDeep(reducer(startState, putPieceOnBoard(0)))
    const pos = 4 * 16 - 5
    tmpState.pieces[0].pos = pos
    tmpState.pieces[0].isBlocking = false

    const state = reducer(tmpState, movePiece(pos, 5))
    expect(state.pieces.filter((p) => p.player === 2 && p.pos === pos).length).to.equal(1)
    expect(state.pieces.filter((p) => p.player === 0 && p.pos === 0).length).to.equal(1)
    expect(state.pieces.length).to.equal(2)
    expect(state.error).to.equal(`Can't remove a blocking piece from the board`)
  })

  it('should remove a piece if one is present at the starting position', () => {
    const tmpState = _.cloneDeep(reducer(startState, putPieceOnBoard(2)))
    tmpState.pieces[0].pos = 0
    tmpState.pieces[0].isBlocking = false

    const state = reducer(tmpState, putPieceOnBoard(0))

    expect(state.players[2].piecesInStock).to.equal(4)
    expect(state.players[0].piecesInStock).to.equal(3)
    expect(state.pieces.length).to.equal(1)

    const piece = state.pieces[0]
    expect(piece.player).to.equal(0)
    expect(piece.isBlocking).to.equal(true)
    expect(piece.pos).to.equal(0)
    expect(piece.isAtDestination).to.equal(false)
  })
})
