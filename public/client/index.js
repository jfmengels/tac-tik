import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'

import routes from './routes'
import createStore from './store'
import { Debug } from './routes/components'

const store = createStore()

const rootElement = (
  <div>
    <Provider store={store}>
      {routes}
    </Provider>
    <Debug store={store} />
  </div>
)

render(rootElement, document.getElementById('root'))
