import React from 'react'

export default ({disabled, onValidate}) => (
  <button disabled={disabled} onClick={onValidate}>
    Validate
  </button>
)
