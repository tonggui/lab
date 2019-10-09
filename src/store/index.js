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
import module from '@/module'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    moduleStates: module.states
  },
  getters: {
    moduleStates () {
      return (key) => {
        return module.getFelid(key)
      }
    }
  }
})

export default store
