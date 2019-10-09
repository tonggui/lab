import categoryMap from './category'
import {
  fetchGetWhiteListModuleMap,
  fetchGetListPageData,
  fetchGetPoiHotRecommend,
  fetchGetPoiViolationInfo,
  fetchGetPoiRiskControl
} from '@/data/repos/poi'
import { WHITELIST_MODULES_MAP } from '@/data/enums/fields'

const source = {
  whiteList: {
    fetch: () => fetchGetWhiteListModuleMap(),
    defaultValue: {
      [WHITELIST_MODULES_MAP.MULTI_TAG]: false,
      [WHITELIST_MODULES_MAP.PRODUCT_VIDEO]: false,
      [WHITELIST_MODULES_MAP.PICTURE_CONTENT]: false
    }
  },
  listPage: {
    fetch: () => fetchGetListPageData(),
    defaultValue: {
      hasPackageBag: false,
      hasTransitionProduct: false,
      errorProductCount: 0,
      unRelationProductCount: 0,
      categoryTemplateGray: false
    }
  },
  poiHotRecommend: {
    fetch: () => fetchGetPoiHotRecommend(),
    defaultValue: false
  },
  poiViolationInfo: {
    fetch: () => fetchGetPoiViolationInfo(),
    defaultValue: false
  },
  poiRiskControl: {
    fetch: () => fetchGetPoiRiskControl(),
    defaultValue: false
  },
  category: ({ categoryIds = [] }) => categoryIds.map(id => categoryMap[id]).filter(category => category.level !== 1)
}
export default source

export const names = Object.keys(source).reduce((prev, name) => {
  prev[name] = name
  return prev
}, {})
