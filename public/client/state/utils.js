import _ from 'lodash'
const noopFunc = (state, action) => state

export const createReducer = (initialState, reducerFuncs) => {
  return (state = initialState, action) => {
    const func = reducerFuncs[action && action.type] || noopFunc
    return func(state, action)
  }
}

/*
 * Merge all action creator functions from multipe state handlers, into one object containing them all.
 * Will throw an error if there are naming collisions, because then some actions would then be lost.
 *
 * Examples:
 * {
 *   stateHandler1: {
 *     reducers: [reducer function],
 *     actions: {
 *       aFunc: [Function],
 *       bFunc: [Function]
 *     }
 *   },
 *   stateHandler2: {
 *     reducers: [reducer function],
 *     actions: {
 *       cFunc: [Function]
 *     }
 *   }
 * }
 * ==>
 * {
 *   aFunc: [Function],
 *   bFunc: [Function],
 *   cFunc: [Function]
 * }
 */
export const mergeActions = (stateHandlers) => {
  const sumKeysLength = (res, handler) => res + _.keys(handler).length
  const numberOfActions = _.reduce(stateHandlers, sumKeysLength, 0)

  const mergedActions = _.values(stateHandlers)
    .reduce((allActions, actions) => {
      return { ...allActions, ...actions }
    }, {})

  if (numberOfActions !== _.keys(mergedActions).length) {
    throw new Error('Conflicting action names')
  }
  return mergedActions
}
