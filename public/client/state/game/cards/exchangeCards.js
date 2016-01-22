import _ from 'lodash/fp'

import { update, setErrorIf, flowSkipOnError } from '../utils'

const cardSelector = (player) =>
  ['players', player, 'cards']

const removeCardFromPlayersHand = ({playerId, card}) =>
  update(cardSelector(playerId), _.remove(card))

const grantCard = ({playerId}, card) =>
  update(cardSelector(playerId), _.concat(card))

const playersAreNotPartners = _.curry((p1, p2, state) =>
  state.players[p1.playerId].partnerId !== p2.playerId
)

const cardIsNotInPlayersHand = _.curry(({playerId, card}, state) =>
  state.players[playerId].cards.indexOf(card) === -1
)

export default _.curry((player1Data, player2Data, state) => {
  const playersAreNotPartnersError = `Can't exchange cards between two players who are not partners`
  const cardIsNotInPlayersHandError = `Could not find card in player's hand`

  return flowSkipOnError(
    setErrorIf(playersAreNotPartners(player1Data, player2Data), playersAreNotPartnersError),
    setErrorIf(cardIsNotInPlayersHand(player1Data), cardIsNotInPlayersHandError),
    setErrorIf(cardIsNotInPlayersHand(player2Data), cardIsNotInPlayersHandError),
    removeCardFromPlayersHand(player1Data),
    removeCardFromPlayersHand(player2Data),
    grantCard(player1Data, player2Data.card),
    grantCard(player2Data, player1Data.card)
  )(state)
})
