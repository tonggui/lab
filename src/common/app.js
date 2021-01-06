import Vue from 'vue'
import { parse } from 'qs'
import { defaultTo, isEmpty } from 'lodash'
import { fetchPageEnvInfo } from '@/data/repos/common'
import { setPageModel } from '@sgfe/eproduct/common/pageModel'
import { setGrayInfo } from '@sgfe/eproduct/gated/gatedModel'
import moduleControl from '@/module'

const pageInfoCache = {}
const defaultPageInfo = {}
let acctIdInfo = {}
let currentPageInfo = {}
let currentRouterTagId

export const parseEnvInfo = (info = {}) => {
  return {
    ...info,
    isMedicine: (info.poiTags || []).some(poiTag => poiTag.isPrimary && [179, 180].includes(poiTag.id))
  }
}

/**
 * 检测当前环境是否为药品模式
 * @return {boolean}
 */
export const isMedicine = () => {
  if (currentPageInfo.poiId) {
    return !!currentPageInfo.isMedicine
  }
  // 跨店模式，需要检测routerTagId定义当前为药品分类模式
  const queryParams = parse(location.search, { ignoreQueryPrefix: true })
  // 22定义为药品的虚拟品类
  if (+queryParams.routerTagId === 22) return true
  return false
}

/**
 * 获取页面灰度信息
 * @param key
 * @return {Map<string, boolean> | any | {}}
 */
export const getPageGrayInfo = (key) => {
  const gray = currentPageInfo.pageGrayInfo || {}
  return key ? gray[key] : gray
}

/**
 * 提供响应式的全局AppState信息
 * @type {never|{isMedicine: *, poiManager: null}}
 */
export const appState = Vue.observable({
  isBusinessClient: window.isB
})

// TODO maxTryTime=2, timeout=2000
export const loadPageEnvInfo = async poiId => {
  let pageInfo = pageInfoCache[poiId]
  if (!pageInfo) {
    try {
      pageInfo = await fetchPageEnvInfo({ poiId })
      pageInfoCache[poiId] = pageInfo
    } catch {}
  }
  return pageInfo
}

export const updatePageInfo = async (poiId, routerTagId) => {
  let newPageInfo = defaultPageInfo
  // 单店场景
  if (poiId) {
    console.log('---poiId', poiId)
    const data = await loadPageEnvInfo(poiId)
    newPageInfo = parseEnvInfo(data)
  } else { // 多店场景
    currentRouterTagId = routerTagId
    if (isEmpty(acctIdInfo)) {
      try {
        acctIdInfo = await fetchPageEnvInfo({ poiId })
      } catch {
        acctIdInfo = {}
      }
    }
    newPageInfo = parseEnvInfo(acctIdInfo)
  }
  // 确认门店信息是否发生变更
  if (currentPageInfo !== newPageInfo) {
    currentPageInfo = newPageInfo
    // 触发修改，更新appState，向下通知变更
    appState.isBusinessClient = defaultTo(currentPageInfo.isB, window.isB)
    // 更新信息，同步到Link的依赖信息中
    setPageModel({
      prefix: currentPageInfo.prefix,
      poiTag: currentPageInfo.virtualPoiTags
    })
    setGrayInfo(currentPageInfo.pageGrayInfo)
  }
  moduleControl.setContext({
    poiId,
    routerTagId,
    categoryList: (currentPageInfo.poiTags || []).filter(cate => !!cate),
    grayInfo: currentPageInfo.pageGrayInfo || {}
  })
}

export const pageGuardBeforeEach = (to, from, next) => {
  const poiId = to.query.wmPoiId || to.params.poiId || to.params.wmPoiId // 单店 场景
  const routerTagId = to.query.routerTagId // 多店 场景
  let pageInfo = pageInfoCache[poiId]
  // 单门店 && 门店信息未缓存 || 多门店 && routerTagId变化
  // 需要更新缓存的门店信息 & 状态
  if ((poiId && !pageInfo) || (!poiId && currentRouterTagId !== routerTagId)) {
    updatePageInfo(poiId, routerTagId).then(() => {
      next()
    })
    return
  }

  next()
}
