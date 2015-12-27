import React from 'react'
import { Router } from 'react-router'

import slidesModules from './slidesModules'
import pageNotFound from './pageNotFound'

export default (
  <Router>
    {slidesModules}
    {pageNotFound}
  </Router>
)
