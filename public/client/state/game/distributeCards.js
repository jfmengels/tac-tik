import _ from 'lodash'
import u from 'updeep'

export default (cards, state) => {
  const cardsForEachPlayer = _.chunk(_.take(cards, 16), 4)

  const updater = {
    players: (players) => {
      return players.map((player, index) => {
        return Object.assign({}, player, {cards: cardsForEachPlayer[index]})
      })
    },
    cardsInDeck: _.takeRight(cards, cards.length - 16)
  }

  return u(updater, state)
}
