import '@/common/polyfill/mouseEnter' // 老壳子 mouseEnter polyfill
import '@/common/owl' // cat
import '@/common/lx' // 灵犀
import '@/directives' // 指令
import '@/filters' // 过滤器
import '@/bootes' // bootes以及全局的一些组件
import '@/plugins/img-lazy-load' // 图片懒加载插件 配置
import '@/styles/index.less' // 样式主体 + 变量

import Vue from 'vue'
import { sync } from 'vuex-router-sync'
import router from './router'
import store from './store'
import { appState } from '@/common/app'
import App from './App.vue'
import module from './module'

Vue.config.productionTip = false
sync(store, router)

new Vue({
  provide: {
    appState
  },
  module,
  router,
  store,
  render: h => h(App)
}).$mount('#app')
