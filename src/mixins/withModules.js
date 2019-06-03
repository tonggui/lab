/*
 * @description
 *   Please write the withModules script's description
 * @author rdshoep(rdshoep@126.com)
 *   http://www.rdshoep.com/
 * @version
 *   1.0.0(2019-06-01)
 */
import { isEqual } from 'lodash'

const mapModuleState = (state = {}, names = []) => {
  if (names.length) {
    return names.reduce((map, name) => {
      if (name in state) {
        map[name] = state[name]
      }
      return map
    }, {})
  } else {
    return state
  }
}

const generateComputedByNames = entries => entries.reduce((map, [key, name]) => {
  map[key] = function () { return this.mixins__state_$ && this.mixins__state_$[name] }
  return map
}, {})

export default (modules = {}) => {
  const entries = Object.entries(modules)
  const names = entries.map(([key, name]) => name)
  if (!names.length) throw new Error('module connect must have some names!')

  return {
    inject: ['poiManager'],
    data () {
      return {
        mixins__state_$: null
      }
    },
    computed: generateComputedByNames(entries),
    created () {
      this.__listener = (state, name) => {
        if (names.includes(name)) {
          const newState = mapModuleState(state, names)
          if (!isEqual(newState, this.mixins__state_$)) {
            this.mixins__state_$ = newState
          }
        }
      }
      this.poiManager.addListener(this.__listener)
      this.poiManager.getState(names)
      this.mixins__state_$ = mapModuleState(this.poiManager.state, names)
    },
    beforeDestroy () {
      this.poiManager.removeListener(this.__listener)
    }
  }
}
