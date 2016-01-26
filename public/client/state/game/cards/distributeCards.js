import _ from 'lodash/fp'

import { update } from '../fp-utils'

/**
 * Distribute a new hand to each players.
 * Each player will be given 4 cards from cards.
 * Every dealt card will be removed from cards.
 * The cardsInDeck field in state will be set to cards without the cards that were dealt.
 * @param  {card[]} cardsInDeck Cards in deck, or a new deck of cards.
 * @param  {object} state State of the game
 * @return {object} Updated state of the game
 */
export default _.curry((cardsInDeck, state) => {
  const {numberOfPlayers} = state.parameters
  const nCards = numberOfPlayers * 4

  const cardsForEachPlayer = _.flow(
    _.take(nCards),
    _.chunk(numberOfPlayers)
  )(cardsInDeck)

  return _.flow(
    // Remove last nCards from deck
    _.set('cardsInDeck', _.takeRight(cardsInDeck.length - nCards, cardsInDeck)),
    // players[i] = cardsForEachPlayer[i]
    update('players', _.flow(
      _.zip(cardsForEachPlayer),
      _.map(([cards, player]) => _.set('cards', cards, player))
    ))
  )(state)
})
