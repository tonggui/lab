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
  fetchGetPoiAuditInfo,
  fetchGetPoiProductCubeSwitch,
  fetchGetPoiProductCubeInfo,
  fetchGetPoiConfig,
  fetchGetProductNewArrivalSwitch,
  fetchSettingBrandProductPromotionGray
} from '@/data/repos/poi'
import {
  fetchGetIsMerchant,
  fetchGetIsHeadQuarterMode,
  fetchGetUnApproveProductCount,
  fetchGetPoiSizeConfig
} from '@/data/repos/merchantPoi'
import {
  getCubeSwitch
} from '@/data/repos/merchantCube'
import {
  isAuditApplyEnabled
} from '@/data/repos/medicineSpAudit'
import { fetchGetPackageProductModuleSwitch } from '@/data/repos/packageProduct'
import { fetchGetNeedAudit } from '@/data/repos/product'
import { defaultWhiteListModuleMap } from '@/data/constants/common'
// import { WHITELIST_MODULES_MAP } from '@/data/enums/fields'
import { isAssociateMedicineMerchant } from '@/module/helper/utils'

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
      description: true, // 商品描述
      b2cSinglePoi: true // 运费模板显示
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
      return fetchGetIsMerchant().catch(e => console.error(`加载总部商品库信息失败: ${e}`))
    },
    defaultValue: false
  },
  medicineQuarterMode: {
    fetch: (context) => {
      // 单店场景 不需要请求
      if (context && context.poiId) {
        return false
      }
      return fetchGetIsHeadQuarterMode().catch(e => console.error(`获取医药商家商品是否是总分模式失败: ${e}`))
    },
    defaultValue: false
  },
  business: {
    fetch: ({ routerTagId }) => fetchGetMultiPoiIsSingleTag(routerTagId),
    defaultValue: true
  },
  category: ({ categoryList = [] } = {}) => {
    // 二级经营品类
    const category = []
    categoryList.forEach(cate => {
      const item = categoryMap[cate.id]
      if (item.level !== 1) {
        category.push(item)
      }
    })
    return category
  },
  primaryCategory: ({ categoryList = [] } = {}) => {
    let primaryCategory
    categoryList.some(cate => {
      const item = categoryMap[cate.id]
      if (cate.isPrimary) {
        primaryCategory = item
        return true
      }
      return false
    })
    return primaryCategory
  },
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
  medicineSpApply: {
    fetch: (context) => {
      // 多店场景 不需要请求
      if (!context || !context.poiId) {
        return false
      }
      return isAuditApplyEnabled(context.poiId)
    },
    defaultValue: {
      auditGray: false,
      spAuditGray: false
    }
  },
  poiAuditInfo: {
    fetch: () => fetchGetPoiAuditInfo(),
    defaultValue: {
      status: undefined,
      info: undefined
    }
  },
  poiConfig: {
    fetch: () => fetchGetPoiConfig(),
    defaultValue: {}
  },
  productCubeSwitch: {
    fetch: () => fetchGetPoiProductCubeSwitch(),
    defaultValue: false
  },
  productCubeInfo: {
    fetch: () => fetchGetPoiProductCubeInfo(),
    defaultValue: {
      title: '平台提供「新店必建商品」，可从中批量选择快捷创建。',
      description: ''
    }
  },
  packageProductSwitch: {
    fetch: () => fetchGetPackageProductModuleSwitch(),
    defaultValue: false
  },
  productAuditInfo: {
    fetch: (context) => {
      // 多店场景 不需要请求
      if (!context || !context.poiId) {
        return false
      }
      return fetchGetNeedAudit()
    },
    defaultValue: {
      poiNeedAudit: false
    }
  },
  productNewArrivalSwitch: { // 商品上新开关 (魔方二期)
    fetch: () => fetchGetProductNewArrivalSwitch(),
    defaultValue: {
      switch: undefined,
      tips: ''
    }
  },
  associateMedicineMerchant: {
    fetch: (context) => {
      // 多店场景 不需要请求
      if (!context || !context.poiId) {
        return false
      }
      return isAssociateMedicineMerchant()
    },
    defaultValue: false
  },
  productPromoteSetting: {
    fetch: (context) => {
      if (!context || !context.poiId) {
        return false
      }
      return fetchSettingBrandProductPromotionGray()
    },
    defaultValue: false
  },

  merchantCubeSwitch: {
    fetch: () => {
      return getCubeSwitch()
    },
    defaultValue: false
  },
  allCubeStatus: {
    fetch: () => {
      const poiProductCubeSwitch = fetchGetPoiProductCubeSwitch()
      const poiAuditInfo = fetchGetPoiAuditInfo()
      const arrivalSwitch = fetchGetProductNewArrivalSwitch()
      return Promise.all([ poiAuditInfo, poiProductCubeSwitch, arrivalSwitch ])
    },
    defaultValue: []
  }
}
export default source

export const names = Object.keys(source).reduce((prev, name) => {
  prev[name] = name
  return prev
}, {})
