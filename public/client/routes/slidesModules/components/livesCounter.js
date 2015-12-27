import React from 'react'
import CSSModules from 'react-css-modules'

import styles from './livesCounter.css'

const LivesCounter = ({ remainingLives, initialLives = 3 }) => {
  const containerStyles = []

  for (let i = 0; i < initialLives; i++) {
    const style = i < remainingLives ? 'full' : 'empty'
    containerStyles.push(style)
  }

  const heartContainers = containerStyles
    .map((style, index) => <span key={index} styleName={style}>X</span>)

  return (
    <div>
      {heartContainers}
    </div>
  )
}

export default CSSModules(LivesCounter, styles)
