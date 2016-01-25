import _ from 'lodash/fp'

import { update } from '../fp-utils'

/**
 * Distribute a new hand to each players.
 * Each player will be given 4 cards from cards.
 * Every dealt card will be removed from cards.
 * The cardsInDeck field in state will be set to cards without the cards that were dealt.
 * @param  {card[]} Cards in deck, or a new deck of cards.
 * @param  {object} state State of the game
 * @return {object} Updated state of the game
 */
export default _.curry((cards, state) => {
  const {numberOfPlayers} = state.parameters
  const nCards = numberOfPlayers * 4

  const cardsForEachPlayer = _.flow(
    _.take(nCards),
    // _.chunk is not data-last. Should be fixed in the next release of lodash
    _.partial(_.chunk, _, numberOfPlayers)
  )(cards)

  return _.flow(
    // Remove last nCards from deck
    _.set(_.takeRight(cards.length - nCards, cards), 'cardsInDeck'),
    // players[i] = cardsForEachPlayer[i]
    update('players', _.flow(
      _.zip(cardsForEachPlayer),
      _.map(([newCards, player]) => _.assign({cards: newCards}, player))
    ))
  )(state)
})
