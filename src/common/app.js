import Vue from 'vue'
import { parse } from 'qs'
import { fetchPageEnvInfo } from '@/data/repos/common'
import PoiManager from '@/common/cmm'

const pageInfoCache = {}
let currentPageInfo = {}

export const parseEnvInfo = (info = {}) => {
  return {
    ...info,
    isMedicine: (info.poiTags || []).some(poiTag => poiTag.isPrimary && [179, 180, 181].includes(poiTag.id))
  }
}

/**
 * 检测当前环境是否为药品模式
 * @return {boolean}
 */
export const isMedicine = () => {
  if (currentPageInfo.poiId) return !!currentPageInfo.isMedicine
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
  isMedicine: isMedicine(),
  poiManager: null
})

// TODO maxTryTime=2, timeout=2000
export const loadPageEnvInfo = async poiId => {
  let pageInfo = pageInfoCache[poiId]
  if (!pageInfo) {
    pageInfo = await fetchPageEnvInfo({ poiId })
    pageInfoCache[poiId] = pageInfo
  }
  return pageInfo
}

export const pageGuardBeforeEach = async (to, from, next) => {
  const poiId = to.query.wmPoiId || to.params.poiId || to.params.wmPoiId
  currentPageInfo = await loadPageEnvInfo(poiId)

  // 确认门店信息是否发生变更
  if (currentPageInfo.poiId !== +poiId) {
    // 触发修改，更新appState，向下通知变更
    appState.isMedicine = isMedicine()
    appState.poiManager = new PoiManager(poiId, currentPageInfo.poiTags.map(t => t.id))
  }

  next()
}
