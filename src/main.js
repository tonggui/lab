import Vue from 'vue'
import Bootes from '@sfe/bootes'
// import "@sfe/bootes/dist/styles/roo.css";
import '@/styles/themes.less'

import App from './App.vue'
import router from './router'
import store from './store'
import './filters'

Vue.config.productionTip = false
Vue.use(Bootes)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
