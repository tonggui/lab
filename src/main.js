import '@/common/polyfill/mouseEnter' // 老壳子 mouseEnter polyfill
import '@/common/owl' // cat
import Vue from 'vue'
import VueLazyload from 'vue-lazyload' // 图片懒加载
import '@/common/lx' // 灵犀
import '@/directives' // 指令
import '@/filters' // 过滤器
import Bootes from '@sfe/bootes' // Bootes
import '@/styles/themes.less' // 样式主体 + 变量
import '@/styles/animate.less' // 动画
import '@/styles/bootes-fix.less' // bootes覆盖样式

import Icon from '@/components/icon/icon' // icon 扩展
import Empty from '@/components/empty' // 全局的空状态组件
import ProductEmpty from '@/components/empty/product-empty' // 商品列表空状态展示组件
import ErrorBoundary from '@/components/error-boundary' // errorBoundary 组件
import InputNumber from '@/components/input-number' // fix bootes inputNumber组件
import Pagination from '@/components/pagination' // fix bootes page组件
import Modal from '@/components/modal'

import ErrorImg from '@/assets/picture-broken.png'

import App from './App.vue'
import router from './router'
import store from './store'

import { pageGuardBeforeEach, appState } from '@/common/app'

Vue.config.productionTip = false
Vue.use(Bootes)
Vue.component('Icon', Icon)
Vue.component('Empty', Empty)
Vue.component('ProductEmpty', ProductEmpty)
Vue.component('InputNumber', InputNumber)
Vue.component('ErrorBoundary', ErrorBoundary)
Vue.component('Pagination', Pagination)
Vue.component('Modal', Modal)

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
