import Vue from 'vue'
import Router from 'vue-router'
import { parse } from 'qs'
import lx from '@/common/lx/lxReport'
import routes from './config'
import moduleControl from '@/module'
import categoryMap from '@/module/category'
import { pageGuardBeforeEach } from '@/common/app'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.VUE_APP_BASE_URL,
  scrollBehavior (_to, _from, _savedPosition) {
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

// 闪购品类控制
router.beforeEach((to, _form, next) => {
  if (to.meta && to.meta.categoryAuth) {
    const context = moduleControl.getContext()
    // 数据异常 需要categoryAuth的路径都是单店路径 存在poiId
    if (!context || !context.categoryIds) {
      next({
        path: '/error',
        query: { type: 'category' },
        replace: true
      })
      return
    }
    // 门店所以经营品类是否是闪购 经营品类
    const valid = context.categoryIds.every(id => !!categoryMap[id])
    if (!valid) {
      next({
        path: '/error',
        query: { type: 'category', invalid: 1 },
        replace: true
      })
      return
    }
    next()
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

let prevPath = ''
// lx pv上报
router.beforeEach((to, _from, next) => {
  if (to.meta) {
    document.title = to.meta.title || '商品管理'
    // 修改 cid
    let $cid = document.querySelector('meta[name="lx:cid"]')
    if (!$cid) {
      $cid = document.createElement('meta')
      $cid.setAttribute('name', 'lx:cid')
      document.querySelector('head').appendChild($cid)
    }
    let cid = to.meta.cid || ''
    if (Array.isArray(cid)) {
      cid.some((c) => {
        if (c.match && c.match(to.query)) {
          cid = c.id
          return true
        }
        return false
      })
    }
    $cid.setAttribute('content', cid)
    if (cid && prevPath !== to.path) {
      prevPath = to.path
      lx.pv({ cid: cid })
    }
  }
  next()
})

export default router
