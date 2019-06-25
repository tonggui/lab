import '@/common/owl'
import Vue from 'vue'
import Bootes from '@sfe/bootes'
// import "@sfe/bootes/dist/styles/roo.css";
import '@/styles/themes.less'

import App from './App.vue'
import router from './router'
import store from './store'

import PoiManager from '@/common/cmm'

const poiManager = new PoiManager('', [])

Vue.config.productionTip = false
Vue.use(Bootes)

new Vue({
  provide: {
    poiManager
  },
  router,
  store,
  render: h => h(App)
}).$mount('#app')
