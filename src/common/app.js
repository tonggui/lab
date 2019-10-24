import Vue from 'vue'
import { parse } from 'qs'
import { fetchPageEnvInfo } from '@/data/repos/common'
// import PoiManager from '@/common/cmm'
import { setPageModel } from '@sgfe/eproduct/common/pageModel'
import { setGrayInfo } from '@sgfe/eproduct/gated/gatedModel'
import module from '@/module'

const pageInfoCache = {}
let currentPageInfo = {}
const cache = {
  duration: 1000 * 60 * 20, // 缓存时间 20分钟
  lastUpdate: -1
}

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
  isBusinessClient: false
  // poiManager: null
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

export const updatePageInfo = async (poiId) => {
  const data = await loadPageEnvInfo(poiId)
  const newPageInfo = parseEnvInfo(data)
  // 确认门店信息是否发生变更
  if (newPageInfo && currentPageInfo !== newPageInfo) {
    currentPageInfo = newPageInfo
    // 触发修改，更新appState，向下通知变更
    appState.isMedicine = isMedicine()
    appState.isBusinessClient = currentPageInfo.isB
    // appState.poiManager = new PoiManager(poiId, (currentPageInfo.poiTags).map(t => t.id))
    module.setContext({ poiId, categoryIds: (currentPageInfo.poiTags).map(t => t.id) })

    // 更新信息，同步到Link的依赖信息中
    setPageModel({
      prefix: currentPageInfo.prefix,
      poiTag: currentPageInfo.virtualPoiTags
    })
    setGrayInfo(currentPageInfo.pageGrayInfo)
  }
}

export const pageGuardBeforeEach = async (to, from, next) => {
  const poiId = to.query.wmPoiId || to.params.poiId || to.params.wmPoiId
  if (Date.now() - cache.lastUpdate > cache.duration) {
    await updatePageInfo(poiId)
    cache.lastUpdate = Date.now()
  }

  next()
}
