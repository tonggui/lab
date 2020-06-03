import Vue from 'vue'
import { register } from './store'

register()

export default Vue.extend({
  render (h) {
    return h('router-view')
  }
})
