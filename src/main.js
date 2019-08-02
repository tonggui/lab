import '@/common/owl'
import Vue from 'vue'
import VueLazyload from 'vue-lazyload'
import '@/common/lx'
import '@/directives/index'
import Bootes from '@sfe/bootes'
import '@/styles/themes.less'
import '@/styles/animate.less'
import '@/styles/bootes-fix.less'

import Icon from '@/components/icon/icon'
import Empty from '@/components/empty'
import ProductEmpty from '@/components/empty/product-empty'

import App from './App.vue'
import router from './router'
import store from './store'
import './filters'

import { pageGuardBeforeEach, appState } from '@/common/app'

Vue.config.productionTip = false
Vue.use(Bootes)
Vue.component('Icon', Icon)
Vue.component('Empty', Empty)
Vue.component('ProductEmpty', ProductEmpty)

Vue.use(VueLazyload, {
  throttleWait: 200
})

// 设置全局页面守卫
router.beforeEach(pageGuardBeforeEach)

new Vue({
  provide: {
    appState
  },
  router,
  store,
  render: h => h(App)
}).$mount('#app')
