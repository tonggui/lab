import Vue from 'vue'
import Router from 'vue-router'
import { parse } from 'qs'
import routes from './config'
import moduleControl from '@/module'
import { install as installLeaveConfirmRouterPlugin } from '@/plugins/router-leave-confirm'
import { install as installLxTimeCounterRouter } from '@/common/lx/lxReport/lxTime'
import { clearTourTimeOut as installClearTourTimeOut } from '@/views/merchant/product/list/merchant-tour.js'
import categoryMap from '@/module/category'
import { pageGuardBeforeEach } from '@/common/app'
import pvRouterGuard from '@/common/lx/pvRouterGuard'
import _get from 'lodash/get'
import { indexOf } from 'lodash'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.VUE_APP_BASE_URL,
  scrollBehavior (to, _from, _savedPosition) {
    if (to.hash) {
      return { selector: to.hash }
    }
    return { x: 0, y: 0 }
  },
  parseQuery (queryString) {
    const queryObject = parse(queryString)
    // 解决传入参数可能存在多wmPoiId的场景，导致内部数据异常
    // 使用query中最后一个wmPoiId为真实使用的poiId
    if (queryObject.wmPoiId && Array.isArray(queryObject.wmPoiId)) {
      queryObject.wmPoiId = queryObject.wmPoiId.pop()
    }
    return queryObject
  },
  routes
})
// 参数传递
router.beforeEach((to, _from, next) => {
  // TODO routerTagId 参数传递
  if (!to.query.routerTagId && _from.query.routerTagId) {
    /**
     * TODO
     * next(location) 会在命令行出现 Uncaught (in promise) undefined
     * https://github.com/vuejs/vue-router/issues/2873
     */
    next({
      ...to,
      query: {
        ...to.query,
        routerTagId: _from.query.routerTagId
      }
    })
    return
  }
  next()
})

// 设置全局页面守卫
router.beforeEach(pageGuardBeforeEach)

const ignoreFrom = [
  '/merchant/product/setting',
  '/product/setting/stockoutAutoClearStock'
]

// 闪购品类控制
router.beforeEach((to, _form, next) => {
  if (to.meta && to.meta.categoryAuth) {
    let isIgnore = false
    if (indexOf(ignoreFrom, _form.path) >= 0) {
      isIgnore = true
      next()
      return
    }
    const context = moduleControl.getContext()
    // 数据异常 需要categoryAuth的路径都是单店路径 存在poiId
    if (!isIgnore && (!context || !context.categoryList)) {
      next({
        path: '/error',
        query: { type: 'category' },
        replace: true
      })
      return
    }
    // 门店所以经营品类是否是闪购 经营品类
    const valid = context.categoryList.every((cate) => cate && !!categoryMap[cate.id])
    if (!valid) {
      next({
        path: '/error',
        query: { type: 'category', invalid: 1 },
        replace: true
      })
      return
    }
  }
  next()
})

// 更新当前pageUrl
router.afterEach((to, from) => {
  // 延迟一下才能获取到跳转后的链接
  setTimeout(() => {
    const pageUrl = window.location.href
    const Owl = window.Owl
    if (Owl && Owl.config) {
      Owl.config({
        pageUrl
      })
    }
    const pathname = window.location.pathname
    // 不是首次进入则手动上报一次PV
    /* eslint-disable */
    if (Akita && Akita.reportPv) {
      Akita.reportPv(pathname, to.name)
    }
    /* eslint-enable */
  }, 100)
})

// 设置title
router.beforeEach((to, _from, next) => {
  const title = _get(to.meta, 'title', '商品管理')
  document.title = title
  next()
})

// lx pv上报
router.beforeEach(pvRouterGuard)

installLxTimeCounterRouter(router)

// 装载页面离开确认插件
installLeaveConfirmRouterPlugin(router)

installClearTourTimeOut(router)

export default router
