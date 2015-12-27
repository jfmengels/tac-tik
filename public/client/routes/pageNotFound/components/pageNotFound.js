import React from 'react'
import CSSModules from 'react-css-modules'

import styles from './pageNotFound.css'

const PageNotFound = () => (
  <div>
    <h1 styleName='title'>Page not found</h1>
    <span styleName='description'>Lost your way?</span>
  </div>
)

export default CSSModules(PageNotFound, styles)
