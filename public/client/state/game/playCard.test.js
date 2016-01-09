import _ from 'lodash'
import u from 'updeep'
import { expect } from 'chai'

import reducer, { playCard } from './'

const playStartCard = (state) => {
  const card = state.players[2].cards[0] // 10/start card
  const cardOptions = { newPiece: true }
  return reducer(state, playCard(2, card, cardOptions))
}

describe('game - playing a card', () => {
  let startState

  beforeEach(() => {
    startState = reducer(undefined, { type: '@@INIT' })
    const updater = {
      players: (players) => {
        return players.map((player) => {
          if (player.id !== 2) {
            return player
          }
          const cards = [
            {value: 10, action: 'START', color: 'blue'},
            {value: 10, action: 'START', color: 'green'},
            {value: 10, action: 'START', color: 'red'},
            {value: 8, action: 'MOVE', color: 'blue'}
          ]
          return Object.assign({}, player, {cards})
        })
      }
    }
    startState = u(updater, startState)
  })

  it(`should remove the played card from the player's hand (first played card)`, () => {
    const previousCards = startState.players[2].cards
    const card = previousCards[0]

    const state = playStartCard(startState)

    const newCards = state.players[2].cards
    expect(newCards.length).to.equal(3)
    expect(_.find(newCards, card)).to.equal(undefined)
    expect([card].concat(newCards), 'value')
      .to.deep.equal(previousCards, 'value')
  })

  it(`should remove the played card from the player's hand (second played card)`, () => {
    const tmpState = playStartCard(startState)
    const previousCards = tmpState.players[2].cards
    const card = previousCards[2]
    const cardOptions = { newPiece: false, piece: 2 * 16 }

    const state = reducer(tmpState, playCard(2, card, cardOptions))

    const newCards = state.players[2].cards
    expect(newCards.length).to.equal(2)
    expect(_.find(newCards, card)).to.equal(undefined)
    expect(newCards.concat(card), 'value')
      .to.deep.equal(previousCards, 'value')
  })

  it(`should put a piece on the board from a played 'start' card`, () => {
    const state = playStartCard(startState)

    expect(state.players[2].piecesInStock).to.equal(3)
    expect(state.pieces.length).to.equal(1)
    const piece = state.pieces[0]
    expect(piece.player).to.equal(2)
    expect(piece.pos).to.equal(2 * 16)
    expect(piece.isBlocking).to.equal(true)
    expect(piece.isAtDestination).to.equal(false)
  })

  it(`should move a piece on the board from a played 'move' card`, () => {
    // Setup: put a piece on the board
    const tmpState = playStartCard(startState)
    const card = tmpState.players[2].cards[0] // 10/start card
    const cardOptions = { newPiece: false, piece: 2 * 16 }

    const state = reducer(tmpState, playCard(2, card, cardOptions))

    expect(state.error).to.equal(null)
    expect(state.players[2].piecesInStock).to.equal(3)
    expect(state.pieces.length).to.equal(1)
    const piece = state.pieces[0]
    expect(piece.player).to.equal(2)
    expect(piece.pos).to.equal(2 * 16 + 10)
    expect(piece.isBlocking).to.equal(false)
    expect(piece.isAtDestination).to.equal(false)
  })

  it(`should move a piece on the board from a played 'start' card`, () => {
    // Setup: put a piece on the board
    const tmpState = playStartCard(startState)
    const card = tmpState.players[2].cards[2] // 8/move card
    const cardOptions = { piece: 2 * 16 }

    const state = reducer(tmpState, playCard(2, card, cardOptions))

    expect(state.error).to.equal(null)
    expect(state.players[2].piecesInStock).to.equal(3)
    expect(state.pieces.length).to.equal(1)
    const piece = state.pieces[0]
    expect(piece.player).to.equal(2)
    expect(piece.pos).to.equal(2 * 16 + 8)
    expect(piece.isBlocking).to.equal(false)
    expect(piece.isAtDestination).to.equal(false)
  })

  it(`should return state with an error and cancel card when playing invalid action`, () => {
    // Setup: put a piece on the board
    const tmpState = playStartCard(startState)
    const card = tmpState.players[2].cards[0] // 10/start card
    const cardOptions = { newPiece: true }

    // A blocking piece should make he action invalid
    const state = reducer(tmpState, playCard(2, card, cardOptions))

    expect(state.error).to.equal(`Can't remove a blocking piece from the board`)
    expect(state.players).to.deep.equal(state.players, 'player info should not have been modified')
    expect(state.pieces).to.deep.equal(state.pieces, 'board pieces should not have been modified')
  })

  it(`should return state with an error and cancel card when playing a card not in the player's hand`, () => {
    const card = {value: 10, action: 'START', color: 'yellow'}
    const cardOptions = { newPiece: true }

    const state = reducer(startState, playCard(2, card, cardOptions))

    expect(state.error).to.equal(`Could not play card absent from player's hand`)
    expect(state.players).to.deep.equal(state.players, 'player info should not have been modified')
    expect(state.pieces).to.deep.equal(state.pieces, 'board pieces should not have been modified')
  })
})
