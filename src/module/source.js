import categoryMap from './category'
import {
  fetchGetListPageData,
  fetchGetPoiHotRecommend,
  fetchGetPoiViolationInfo,
  fetchGetPoiRiskControl,
  fetchGetFieldVisibleConfig,
  fetchGetMultiPoiIsSingleTag,
  fetchGetWhiteListModuleMap,
  fetchGetPoiBusinessTemplateInfo
} from '@/data/repos/poi'
import {
  fetchGetIsMerchant,
  fetchGetUnApproveProductCount
} from '@/data/repos/merchantPoi'
import { defaultWhiteListModuleMap } from '@/data/constants/common'
// import { WHITELIST_MODULES_MAP } from '@/data/enums/fields'

const source = {
  unApproveProduct: {
    fetch: () => fetchGetUnApproveProductCount(),
    defaultValue: 0
  },
  fieldConfig: {
    fetch: () => fetchGetFieldVisibleConfig(),
    defaultValue: {
      sellTime: true, // 可售时间
      packBag: true, // 包装袋
      description: true // 商品描述
    }
  },
  whiteList: {
    fetch: ({ poiId }) => {
      if (!poiId) {
        return { ...defaultWhiteListModuleMap }
      }
      return fetchGetWhiteListModuleMap(poiId)
    },
    defaultValue: {
      ...defaultWhiteListModuleMap
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
  merchantAccount: {
    fetch: () => fetchGetIsMerchant(),
    defaultValue: false
  },
  business: {
    fetch: ({ routerTagId }) => fetchGetMultiPoiIsSingleTag(routerTagId),
    defaultValue: true
  },
  category: ({ categoryIds = [] } = {}) => categoryIds.map(id => categoryMap[id]).filter(category => category.level !== 1),
  routerTagId: ({ routerTagId }) => routerTagId,
  businessTemplate: {
    fetch: () => fetchGetPoiBusinessTemplateInfo(),
    defaultValue: {
      used: false,
      exist: false
    }
  }
}
export default source

export const names = Object.keys(source).reduce((prev, name) => {
  prev[name] = name
  return prev
}, {})
