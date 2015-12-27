import React from 'react'
import { DevTools, DebugPanel, LogMonitor } from 'redux-devtools/lib/react'

const Debug = ({store}) => (
  <DebugPanel top right bottom>
    <DevTools store={store} monitor={LogMonitor} visibleOnLoad={false} />
  </DebugPanel>
)

Debug.propTypes = {
  store: React.PropTypes.object.isRequired
}

export default Debug
