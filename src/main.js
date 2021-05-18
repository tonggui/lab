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
import GrayRouterView from './router/gray-router-view'
import store from './store'
import { appState } from '@/common/app'
import setupPageJumper from '@/common/page-jumper/setup'
import App from './App.vue'
import moduleControl from './module'
import appendMenu from '@sfe/queenbee-menu'
if (process.env.NODE_ENV === 'development') {
  const cookie = `_lxsdk_cuid=174d7b3e9c9c8-0cbd94585126cd-153e6555-1ea000-174d7b3e9cac8; _lxsdk=174d7b3e9c9c8-0cbd94585126cd-153e6555-1ea000-174d7b3e9cac8; UM_distinctid=1775d521f1c4c1-07ca55772bf06b-6915227c-1ea000-1775d521f1da4b; uuid_update=true; pushToken=0qDip9qS1cveqRqgL7l6kd1pJIcmgCTGk7CdlGSFmL_s*; acctId=112524656; token=0xHS9AQvxlSAeAx8QUzBKLLsGWt21rHgAASYRR69iG9w*; brandId=-1; city_id=652800; isChain=1; existBrandPoi=true; ignore_set_router_proxy=true; region_id=; region_version=0; newCategory=true; bsid=_JwIQqiYOfrOKnUdKa-y-ILSyv78B7qOJVOtZymQrzMyuV8Z1aNKV8fmQcaq8yOUZ4QzxOI2QzVYjo4rM2kJFg; device_uuid=!658ad1ec-aa97-4ad1-9a22-54079c2ed514; cityId=0; provinceId=0; pharmacistAccount=0; wpush_server_url=ws://wpush.waimai.test.meituan.com; city_location_id=0; location_id=0; JSESSIONID=9wss8zzcsgkb1kzmedb9ovory; cacheTimeMark=2021-05-13; igateApp=shangouepc; s_m_id_3299326472=AwMAAAA5AgAAAAEAAAE9AAAALDtkKDb/sGXhhA+iPdeU54UnOJpvgiv+iYXFMueARxYtJa009AAM4/miUDdvAAAAI01NvsIwiZ33O6sBnXSaR+sqn0gI79faAluq+qlMWM0fx7cS; isOfflineSelfOpen=0; wmPoiId=662017; wmPoiName=%E5%AD%99%E5%BF%97%E8%BE%89%E6%B2%83%E5%B0%94%E7%8E%9B%E6%B5%8B%E8%AF%95%E9%97%A8%E5%BA%97; logistics_support=1; set_info=%7B%22wmPoiId%22%3A662017%2C%22ignoreSetRouterProxy%22%3Atrue%7D; isNewCome=1; shopCategory=market; _lxsdk_s=17964843243-797-e7d-858%7C112524656%7C64`
  cookie.split('; ').map((str) => {
    document.cookie = str
  })
}
Vue.component('gray-router-view', GrayRouterView)

setupPageJumper(Vue, router)
Vue.config.productionTip = false
Vue.config.errorHandler = function (err) {
  if (window.onerror) {
    if (typeof err === 'string') {
      window.onerror(err, 'unknow', 0, 0)
    } else {
      window.onerror(err.message, 'unknow', 0, 0, err)
    }
  }
  console.error(err)
}
sync(store, router)

new Vue({
  provide: {
    appState
  },
  moduleControl: moduleControl,
  router,
  store,
  render: h => h(App)
}).$mount('#app')

appendMenu()
