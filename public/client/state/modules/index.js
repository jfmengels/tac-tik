const LOAD_MODULE_LIST = 'modules/LOAD_MODULE_LIST'

export default function reducer (state = [], action = {}) {
  if (action.type === LOAD_MODULE_LIST) {
    return action.moduleList
  }
  return state
}

export const loadModuleList = (moduleList) => {
  return {
    moduleList,
    type: LOAD_MODULE_LIST
  }
}
