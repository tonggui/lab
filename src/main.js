import '@/common/owl'
import Vue from 'vue'
import VueLazyload from 'vue-lazyload'
import Bootes from '@sfe/bootes'
import '@/styles/themes.less'
import '@/styles/animate.less'
import '@/styles/bootes-fix.less'

import Icon from '@/components/icon/icon'

import App from './App.vue'
import router from './router'
import store from './store'
import './filters'

import { pageGuardBeforeEach, appState } from '@/common/app'

Vue.config.productionTip = false
Vue.use(Bootes)
Vue.component('Icon', Icon)

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
