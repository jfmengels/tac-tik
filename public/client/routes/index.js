import React from 'react'
import { Router } from 'react-router'

import game from './game'
import pageNotFound from './pageNotFound'

export default (
  <Router>
    {game}
    {pageNotFound}
  </Router>
)
