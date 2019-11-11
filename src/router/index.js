import Vue from 'vue'
import Router from 'vue-router'
import lx from '@/common/lx/lxReport'
import routes from './config'
import { pageGuardBeforeEach } from '@/common/app'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.VUE_APP_BASE_URL,
  scrollBehavior (_to, _from, _savedPosition) {
    return { x: 0, y: 0 }
  },
  routes
})
// 设置全局页面守卫
router.beforeEach(pageGuardBeforeEach)

// 参数传递
router.beforeEach((to, _from, next) => {
  // TODO routerTagId 参数传递
  if (!to.query.routerTagId && _from.query.routerTagId) {
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
    // 不是首次进入则手动上报一次PV
    /* eslint-disable */
    if (Akita && Akita.reportPv && from.fullPath !== '/') {
      Akita.reportPv(pageUrl, to.name)
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
