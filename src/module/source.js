import categoryMap from './category'
import {
  fetchGetListPageData,
  fetchGetPoiHotRecommend,
  fetchGetPoiViolationInfo,
  fetchGetPoiRiskControl,
  fetchGetFieldVisibleConfig,
  fetchGetFunctionConfig,
  fetchGetMultiPoiIsSingleTag,
  fetchGetWhiteListModuleMap,
  fetchGetPoiBusinessTemplateInfo,
  fetchGetPoiAuditProductStatistics
} from '@/data/repos/poi'
import {
  fetchGetIsMerchant,
  fetchGetUnApproveProductCount,
  fetchGetPoiSizeConfig
} from '@/data/repos/merchantPoi'
import {
  PRODUCT_AUDIT_STATUS
} from '@/data/enums/product'
import { defaultWhiteListModuleMap } from '@/data/constants/common'
// import { WHITELIST_MODULES_MAP } from '@/data/enums/fields'

const source = {
  unApproveProduct: {
    fetch: () => fetchGetUnApproveProductCount(),
    defaultValue: 0
  },
  poiFieldConfig: {
    fetch: () => fetchGetFieldVisibleConfig(),
    defaultValue: {
      sellTime: true, // 可售时间
      packBag: true, // 包装袋
      description: true // 商品描述
    }
  },
  globalFieldConfig: {
    fetch: () => fetchGetFunctionConfig(),
    defaultValue: {
      limitSale: false // 可售时间
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
    fetch: (context) => {
      // 单店场景 不需要请求
      if (context && context.poiId) {
        return false
      }
      return fetchGetIsMerchant()
    },
    defaultValue: false
  },
  business: {
    fetch: ({ routerTagId }) => fetchGetMultiPoiIsSingleTag(routerTagId),
    defaultValue: true
  },
  category: ({ categoryIds = [] } = {}) => categoryIds.map(id => categoryMap[id]).filter(category => category.level !== 1),
  routerTagId: ({ routerTagId }) => routerTagId,
  grayInfo: ({ grayInfo }) => grayInfo || {},
  businessTemplate: {
    fetch: () => fetchGetPoiBusinessTemplateInfo(),
    defaultValue: {
      used: false,
      exist: false
    }
  },
  poiSizeConfig: {
    fetch: () => fetchGetPoiSizeConfig(),
    defaultValue: 2000
  },
  auditProductStatistics: {
    fetch: () => fetchGetPoiAuditProductStatistics(),
    defaultValue: {
      total: 0, // 总数
      [PRODUCT_AUDIT_STATUS.AUDITING]: 0,
      [PRODUCT_AUDIT_STATUS.AUDIT_REJECTED]: 0,
      [PRODUCT_AUDIT_STATUS.AUDIT_REVOCATION]: 0,
      [PRODUCT_AUDIT_STATUS.AUDIT_REVOCATION]: 0
    }
  }
}
export default source

export const names = Object.keys(source).reduce((prev, name) => {
  prev[name] = name
  return prev
}, {})
