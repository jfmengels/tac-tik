import _ from 'lodash/fp'

import { update } from './utils'

export default _.curry((cards, state) => {
  const {numberOfPlayers} = state.parameters
  const nCards = numberOfPlayers * 4

  const cardsForEachPlayer = _.flow(
    _.take(nCards),
    // _.chunk is not data-last. Should be fixed in the next release of lodash
    _.partial(_.chunk, _, numberOfPlayers)
  )(cards)

  const cardsInDeck = _.takeRight(cards.length - nCards, cards)

  return _.flow(
    // Remove last nCards from deck
    _.assign({cardsInDeck}),
    // players[i] = cardsForEachPlayer[i]
    update('players', _.flow(
      _.zip(cardsForEachPlayer),
      _.map(([newCards, player]) => _.assign({cards: newCards}, player))
    ))
  )(state)
})
