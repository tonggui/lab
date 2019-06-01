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

const generateComputedByNames = names => names.reduce((map, name) => {
  map[name] = function () { return this.state && this.state[name] }
  return map
}, {})

export default (names = []) => {
  names = [].concat(names)
  if (!names.length) throw new Error('module connect must have some names!')

  return {
    inject: ['poiManager'],
    data () {
      return {
        state: null
      }
    },
    computed: generateComputedByNames(names),
    created () {
      this.__listener = (state, name) => {
        if (names.includes(name)) {
          const newState = mapModuleState(state, names)
          if (!isEqual(newState, this.state)) {
            this.state = newState
          }
        }
      }
      this.poiManager.addListener(this.__listener)
      this.poiManager.getState(names)
      this.state = mapModuleState(this.poiManager.state, names)
    },
    beforeDestroy () {
      this.poiManager.removeListener(this.__listener)
    }
  }
}
