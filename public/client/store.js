import { compose, createStore, applyMiddleware } from 'redux'
import { devTools, persistState } from 'redux-devtools'
import thunk from 'redux-thunk'

import { reducers } from './state'

const middleware = [
  applyMiddleware(thunk),
  devTools(),
  persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/))
]

const finalCreateStore = compose(...middleware)(createStore)

export default (initialState) => {
  const store = finalCreateStore(reducers, reducers(initialState))
  if (module.hot) {
    module.hot.accept('./state', () => {
      const nextRootReducer = require('./state').reducers
      store.replaceReducer(nextRootReducer)
    })
  }
  return store
}
