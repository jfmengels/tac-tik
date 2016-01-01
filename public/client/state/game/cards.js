import _ from 'lodash'

const starters = [1, 10].map((value) => ({value, action: 'START'}))
const permuters = {value: 'PERMUTE', action: 'PERMUTE'}
const movers = [2, 3, -4, 5, 6, 8, 9, 12].map((value) => ({value, action: 'MOVE'}))
const multiMover = {value: 7, action: 'MULTI'}

const cards = [].concat(starters, permuters, movers, multiMover)

const colors = ['red', 'blue', 'green', 'yellow']

const allCards = _.flatten(
  cards.map(
    (card) => colors.map(
      (color) => Object.assign({}, card, {color})
    )
  )
)

export default () => _.shuffle(allCards)
