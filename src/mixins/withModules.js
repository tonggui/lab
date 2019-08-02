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
  map[key] = function () {
    return this.states_withModules_$ && this.states_withModules_$[name]
  }
  return map
}, {})

export default (modules = {}) => {
  const entries = Object.entries(modules)
  const names = entries.map(([key, name]) => name)
  if (!names.length) throw new Error('module connect must have some names!')

  return {
    inject: ['appState'],
    data () {
      return {
        states_withModules_$: null
      }
    },
    computed: {
      poiManager () {
        return this.appState.poiManager
      },
      ...generateComputedByNames(entries)
    },
    watch: {
      poiManager: {
        immediate: true,
        handler (cur, prev) {
          if (prev) {
            prev.removeListener(this.$_withModules_listener)
          }
          if (cur) {
            cur.addListener(this.$_withModules_listener)
            cur.getState(names)
            this.states_withModules_$ = mapModuleState(cur.state, names)
          }
        }
      }
    },
    methods: {
      $_withModules_listener (state, name) {
        if (names.includes(name)) {
          const newState = mapModuleState(state, names)
          if (!isEqual(newState, this.states_withModules_$)) {
            this.states_withModules_$ = newState
          }
        }
      }
    },
    beforeDestroy () {
      if (this.poiManager) {
        this.poiManager.removeListener(this.$_withModules_listener)
      }
    }
  }
}
