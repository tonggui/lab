import '@/common/polyfill/mouseEnter'
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
import ErrorBoundary from '@/components/error-boundary'
import InputNumber from '@/components/input-number'

import ErrorImg from '@/assets/picture-broken.png'

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
Vue.component('InputNumber', InputNumber)
Vue.component('ErrorBoundary', ErrorBoundary)

Vue.use(VueLazyload, {
  throttleWait: 200,
  error: ErrorImg
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
