import { names as source } from './source'
import * as types from './moduleTypes'
import { some, every, isMedicineAccount, isMedicineBusiness } from '@/module/helper/utils'
import createFelid from '@/module/helper/createFelid'
import { defaultWhiteListModuleMap } from '@/data/constants/common'

const module = {
  [types.PRODUCT_CREATE_ENTRANCE]: createFelid(
    source.whiteList,
    false,
    (whiteList) => whiteList.allowCustomProduct
  ),
  [types.BATCH_UPLOAD_IMAGE]: createFelid(
    source.category,
    false,
    some(category => !isMedicineBusiness(category))
  ),
  [types.SWITCH_SUGGEST_NOUPC]: createFelid(
    source.category,
    false,
    every((category) => category.pid === 21)
  ),
  [types.PRODUCT_SHORTCUT]: createFelid(
    source.category,
    false,
    some((category) => [20, 21, 22, 5007, 5012].includes(category.pid))
  ),
  [types.PRODUCT_SELL_TIME]: createFelid(
    source.fieldConfig,
    true,
    (config) => config.sellTime
  ),
  [types.PRODUCT_DESCRIPTION]: createFelid(
    source.fieldConfig,
    true,
    (config) => config.description
  ),
  [types.PRODUCT_PACK_BAG]: createFelid(
    source.fieldConfig,
    true,
    (config) => config.packBag
  ),
  [types.PRODUCT_PICTURE_CONTENT]: createFelid(
    source.whiteList,
    false,
    (whiteList) => whiteList.allowGraphicDescription
  ),
  [types.PRODUCT_LABEL]: createFelid(
    source.category,
    true,
    some((category) => !isMedicineBusiness(category), true)
  ),
  [types.PRODUCT_PICTURE_EDITABLE]: createFelid(
    source.category,
    false,
    some((category) => !isMedicineBusiness(category))
  ),
  [types.PRODUCT_NAME_EDITABLE]: createFelid(
    source.category,
    false,
    some(category => !isMedicineBusiness(category))
  ),
  [types.PRODUCT_INCOMPLETE_TAB]: createFelid(
    source.category,
    false,
    every(category => isMedicineBusiness(category))
  ),
  // 多分类数目 药品全开 不受白名单控制
  [types.PRODUCT_TAG_COUNT]: createFelid(
    [source.whiteList, source.category],
    1,
    ([whiteList, categoryIdList]) => {
      const flag = whiteList.allowMultiProductTag || every(c => isMedicineBusiness(c))(categoryIdList)
      return flag ? 5 : 1
    }
  ),
  [types.PRODUCT_VIDEO]: createFelid(
    source.whiteList,
    false,
    (whiteList) => whiteList.allowProductVideo
  ),
  [types.PRODUCT_SMART_SORT]: createFelid(
    source.category,
    false,
    every(category => !isMedicineBusiness(category))
  ),
  [types.POI_HOT_RECOMMEND]: createFelid(
    source.poiHotRecommend,
    false
  ),
  [types.POI_RISK_CONTROL]: createFelid(
    source.poiRiskControl,
    false
  ),
  [types.POI_VIOLATION]: createFelid(
    source.poiViolationInfo,
    false
  ),
  [types.POI_SHOPPING_BAG]: createFelid(
    source.listPage,
    false,
    (data) => data.hasPackageBag
  ),
  [types.POI_RECYCLE]: createFelid(
    source.category,
    false,
    some(category => !isMedicineBusiness(category))
  ),
  [types.POI_TRANSITION_PRODUCT]: createFelid(
    source.listPage,
    false,
    (data) => data.hasTransitionProduct
  ),
  [types.POI_ERROR_PRODUCT_COUNT]: createFelid(
    source.listPage,
    0,
    (data) => data.errorProductCount
  ),
  [types.POI_UN_RELATION_PRODUCT_COUNT]: createFelid(
    source.listPage,
    0,
    (data) => data.unRelationProductCount
  ),
  [types.TAG_TOP_TIME]: createFelid(
    source.category,
    false,
    every(category => !isMedicineBusiness(category))
  ),
  [types.TAG_APP_CODE]: createFelid(
    source.category,
    false,
    every(category => isMedicineBusiness(category))
  ),
  [types.TAG_SMART_SORT]: createFelid(
    source.category,
    false,
    every(category => !isMedicineBusiness(category))
  ),
  [types.CATEGORY_TEMPLATE]: createFelid(
    source.listPage,
    false,
    (data) => data.categoryTemplateGray
  ),
  [types.TAG_FIRST_LEVEL_LIMIT]: createFelid(
    source.listPage,
    Infinity,
    ({ maxFirstTagConfig } = {}) => {
      if (!maxFirstTagConfig) {
        return Infinity
      }
      return maxFirstTagConfig.maxFirstLevelNum || Infinity
    }
  ),
  [types.TAG_FIRST_LEVEL_GUIDE]: createFelid(
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
  [types.MERCHANT_ACCOUNT]: createFelid(
    source.merchantAccount,
    false
  ),
  [types.SINGLE_BUSINESS]: createFelid(
    source.business,
    true,
    (data) => !!data
  ),
  [types.BATCH_CREATE_USE_SP_IMAGE]: createFelid(
    [source.routerTagId, source.category],
    false,
    ([routerTagId, categoryList]) => !isMedicineAccount(categoryList, routerTagId)
  ),
  [types.UNAPPROVE_PRODUCT_COUNT]: createFelid(
    source.unApproveProduct,
    0,
    (count) => count
  ),
  [types.POI_PROPERTY_LOCKED]: createFelid(
    source.whiteList,
    defaultWhiteListModuleMap.propertyEditLock,
    (whiteList) => whiteList.propertyEditLock
  ),
  [types.POI_CUSTOM_PRODUCT]: createFelid(
    source.whiteList,
    defaultWhiteListModuleMap.allowCustomProduct,
    (whiteList) => whiteList.allowCustomProduct
  ),
  [types.BUSINESS_MEDICINE]: createFelid(
    [source.category, source.routerTagId],
    false,
    ([categoryList, routerTagId]) => isMedicineAccount(categoryList, routerTagId)
  )
}

export default module
