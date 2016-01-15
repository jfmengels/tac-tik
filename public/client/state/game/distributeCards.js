import _ from 'lodash/fp'

import { applyToKeyAndAssign } from './common'

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
    applyToKeyAndAssign('cardsInDeck', () => _.takeRight(cards.length - nCards, cards)),
    // players[index] = cardsForEachPlayer[index]
    applyToKeyAndAssign('players',
      _.flow(
        _.zip(cardsForEachPlayer),
        _.map(([newCards, player]) => {
          return _.assign({cards: newCards}, player)
        })
      )
    )
  )(state)
})
