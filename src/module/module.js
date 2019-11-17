import { names as source } from './source'
import * as types from './moduleTypes'
import { isNormalMedicine } from './category/helper'
import { WHITELIST_MODULES_MAP } from '@/data/enums/fields'
import { some, every } from '@/module/helper/utils'
import createFeild from '@/module/helper/createFeild'

const module = {
  [types.PRODUCT_CREATE_ENTRANCE]: createFeild(
    source.category,
    false,
    some(category => !isNormalMedicine(category))
  ),
  [types.BATCH_UPLOAD_IMAGE]: createFeild(
    source.category,
    false,
    some(category => !isNormalMedicine(category))
  ),
  [types.SWITCH_SUGGEST_NOUPC]: createFeild(
    source.category,
    false,
    every((category) => category.pid === 21)
  ),
  [types.PRODUCT_SHORTCUT]: createFeild(
    source.category,
    false,
    some((category) => [20, 21, 22, 5007, 5012].includes(category.pid))
  ),
  [types.PRODUCT_SELL_TIME]: createFeild(
    source.fieldConfig,
    true,
    (config) => config.sellTime
  ),
  [types.PRODUCT_DESCRIPTION]: createFeild(
    source.fieldConfig,
    true,
    (config) => config.description
  ),
  [types.PRODUCT_PACK_BAG]: createFeild(
    source.fieldConfig,
    true,
    (config) => config.packBag
  ),
  [types.PRODUCT_PICTURE_CONTENT]: createFeild(
    source.whiteList,
    false,
    (whiteList) => whiteList[WHITELIST_MODULES_MAP.PICTURE_CONTENT]
  ),
  [types.PRODUCT_LABEL]: createFeild(
    source.category,
    true,
    some((category) => !isNormalMedicine(category), true)
  ),
  [types.PRODUCT_PICTURE_EDITABLE]: createFeild(
    source.category,
    false,
    some((category) => !isNormalMedicine(category))
  ),
  [types.PRODUCT_NAME_EDITABLE]: createFeild(
    source.category,
    false,
    some(category => !isNormalMedicine(category))
  ),
  [types.PRODUCT_INCOMPLETE_TAB]: createFeild(
    source.category,
    false,
    every(category => isNormalMedicine(category))
  ),
  // 多分类数目 药品全开 不受白名单控制
  [types.PRODUCT_TAG_COUNT]: createFeild(
    [source.whiteList, source.category],
    1,
    ([whiteList, categoryIdList]) => {
      const flag = whiteList[WHITELIST_MODULES_MAP.MULTI_TAG] || every(c => isNormalMedicine(c))(categoryIdList)
      return flag ? 5 : 1
    }
  ),
  [types.PRODUCT_VIDEO]: createFeild(
    source.whiteList,
    false,
    (whiteList) => whiteList[WHITELIST_MODULES_MAP.PRODUCT_VIDEO]
  ),
  [types.PRODUCT_SMART_SORT]: createFeild(
    source.category,
    false,
    every(category => !isNormalMedicine(category))
  ),
  [types.POI_HOT_RECOMMEND]: createFeild(
    source.poiHotRecommend,
    false
  ),
  [types.POI_RISK_CONTROL]: createFeild(
    source.poiRiskControl,
    false
  ),
  [types.POI_VIOLATION]: createFeild(
    source.poiViolationInfo,
    false
  ),
  [types.POI_SHOPPING_BAG]: createFeild(
    source.listPage,
    false,
    (data) => data.hasPackageBag
  ),
  [types.POI_RECYCLE]: createFeild(
    source.category,
    false,
    some(category => !isNormalMedicine(category))
  ),
  [types.POI_TRANSITION_PRODUCT]: createFeild(
    source.listPage,
    false,
    (data) => data.hasTransitionProduct
  ),
  [types.POI_ERROR_PRODUCT_COUNT]: createFeild(
    source.listPage,
    0,
    (data) => data.errorProductCount
  ),
  [types.POI_UN_RELATION_PRODUCT_COUNT]: createFeild(
    source.listPage,
    0,
    (data) => data.unRelationProductCount
  ),
  [types.TAG_TOP_TIME]: createFeild(
    source.category,
    false,
    every(category => !isNormalMedicine(category))
  ),
  [types.TAG_APP_CODE]: createFeild(
    source.category,
    false,
    every(category => isNormalMedicine(category))
  ),
  [types.TAG_SMART_SORT]: createFeild(
    source.category,
    false,
    every(category => !isNormalMedicine(category))
  ),
  [types.CATEGORY_TEMPLATE]: createFeild(
    source.listPage,
    false,
    (data) => data.categoryTemplateGray
  ),
  [types.TAG_FIRST_LEVEL_LIMIT]: createFeild(
    source.listPage,
    Infinity,
    ({ maxFirstTagConfig } = {}) => {
      if (!maxFirstTagConfig) {
        return Infinity
      }
      return maxFirstTagConfig.maxFirstLevelNum || Infinity
    }
  ),
  [types.TAG_FIRST_LEVEL_GUIDE]: createFeild(
    source.listPage,
    {},
    ({ maxFirstTagConfig } = {}) => {
      const { content, url } = maxFirstTagConfig || {}
      return {
        link: url || '',
        content: content || ''
      }
    }
  ),
  [types.MERCHANT_ACCOUNT]: createFeild(
    source.merchantAccount,
    false
  ),
  [types.SINGLE_BUSINESS]: createFeild(
    source.business,
    true,
    (data = {}) => (data || {}).singlePoiTagFlag
  ),
  [types.BATCH_CREATE_USE_SP_IMAGE]: createFeild(
    [source.routerTagId, source.category],
    false,
    (routerTagId, categoryList) => {
      // TODO
      if (categoryList) {
        return every(category => !isNormalMedicine(category))(categoryList)
      }
      return (+routerTagId) !== 22
    }),
  [types.UNAPPROVE_PRODUCT_COUNT]: createFeild(
    source.unApproveProduct,
    0,
    (count) => count
  )
}

export default module
