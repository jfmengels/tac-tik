import _ from 'lodash'
import { combineReducers } from 'redux'

import { mergeActions } from './utils'
import * as slides from './slides'
import * as modules from './modules'

const defaultFunction = ({default: def}) => def

const stateHandlers = {
  slides,
  modules
}

const reducerFuncs = _.mapValues(stateHandlers, defaultFunction)
export const reducers = combineReducers(reducerFuncs)

const actionCreators = _(stateHandlers)
  .mapValues((handler) => _.omit(handler, 'default'))
  .value()
export const actions = Object.freeze(mergeActions(actionCreators))
