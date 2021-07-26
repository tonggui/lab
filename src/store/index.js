/*
 * @description
 *   Please write the index.js script's description
 * @author
 *   rdshoep (zhangliang15@meituan.com)
 * @version
 *   1.0.0(2019-05-27)
 */
import Vue from 'vue'
import Vuex from 'vuex'
import moduleControl from '@/module'

Vue.use(Vuex)
const store = new Vuex.Store({
  state: {
    moduleStates: moduleControl.states
  },
  getters: {
    moduleStates (state) {
      return (key) => {
        moduleControl.getFelid(key)
        return state.moduleStates[key]
      }
    }
  }
})

export default store
