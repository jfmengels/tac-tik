import _ from 'lodash'
import { combineReducers } from 'redux'

import { mergeActions } from './utils'
import * as game from './game'

const defaultFunction = (mod) => mod.default

const stateHandlers = {
  game
}

const reducerFuncs = _.mapValues(stateHandlers, defaultFunction)
export const reducers = combineReducers(reducerFuncs)

const actionCreators = _(stateHandlers)
  .mapValues((handler) => _.omit(handler, 'default'))
  .value()

export const actions = Object.freeze(mergeActions(actionCreators))
