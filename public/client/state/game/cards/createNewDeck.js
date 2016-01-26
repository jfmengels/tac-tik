import _ from 'lodash/fp'

const starters = [1, 10].map((value) => ({value, action: 'START'}))
const permuters = {value: 'PERMUTE', action: 'PERMUTE'}
const movers = [2, 3, -4, 5, 6, 8, 9, 12].map((value) => ({value, action: 'MOVE'}))
const multiMover = {value: 7, action: 'MULTI'}

const cards = [].concat(starters, permuters, movers, multiMover)

const colors = ['red', 'blue', 'green', 'yellow']

// allCards: cartesian product of colors and cards
const allCards = _.flatMap(
  (color) => _.map(_.set('color', color), cards),
  colors
)

/**
 * Return a new shuffled deck of cards.
 * The deck will always contain the same set of cards, but the order of the cards
 * will be different on consecutive calls.
 * @return {card[]} Array of cards of the form
 * {
 *   value: <number> | "PERMUTE",
 *   action: "MOVE" | "MULTI" | "START" | "PERMUTE",
 *   color: "red" | "blue" | "green" | "yellow"
 * }
 */
export default () => _.shuffle(allCards)
