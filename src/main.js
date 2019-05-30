import Vue from 'vue'
import Bootes from '@sfe/bootes'
import '@/styles/themes.less'

import Icon from '@/components/icon/icon'

import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false
Vue.use(Bootes)
Vue.component('Icon', Icon)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
