import React from 'react'
import { Route } from 'react-router'

import { ModuleList, SlidesModules } from './containers'

export default (
  <Route path='/' component={ModuleList}>
    <Route path=':ref' component={SlidesModules} />
  </Route>
)
