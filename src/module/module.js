import { names as source } from './source'
import * as types from './moduleTypes'
import { some, every, isMedicineAccount, isMedicineBusiness, getProductNameExample } from '@/module/helper/utils'
import createFelid from '@/module/helper/createFelid'
import { defaultWhiteListModuleMap } from '@/data/constants/common'
import { STATUS as POI_AUDIT_STATUS } from '@/data/enums/poi'
import { AUDIT_INFO } from '@/data/constants/poi'

const module = {
  [types.PRODUCT_CREATE_ENTRANCE]: createFelid(
    source.whiteList,
    false,
    (whiteList) => whiteList.allowCustomProduct,
    { needSourceLoaded: true }
  ),
  [types.BATCH_UPLOAD_IMAGE]: createFelid(
    source.category,
    false,
    some(category => !isMedicineBusiness(category))
  ),
  // TODO 此字段已去掉
  [types.SWITCH_SUGGEST_NOUPC]: createFelid(
    source.category,
    false,
    () => false
  ),
  /**
   * https://km.sankuai.com/page/152267436
   * 快捷方式展示经营品类为
   * 二级品类：11020000，11040000，11030000，6005，4012，6006
   * 一级品类：12000000，13000000，14000000，15000000，5007
   * TODO 品类数据清洗完成后 删除旧品类的兼容
   * 旧品类：20、21、22、5007、5012
   */
  [types.PRODUCT_SHORTCUT]: createFelid(
    source.category,
    false,
    some((category) => {
      const firstCategory = [12000000, 13000000, 14000000, 15000000, 5007, 20, 21, 22, 5012]
      const secondCategory = [11020000, 11040000, 11030000, 6005, 4012, 6006]
      return firstCategory.includes(category.pid) || secondCategory.includes(category.id)
    })
  ),
  [types.PRODUCT_LIMIT_SALE]: createFelid(
    source.globalFieldConfig,
    false,
    (config) => config.limitSale
  ),
  [types.PRODUCT_SELL_TIME]: createFelid(
    source.poiFieldConfig,
    true,
    (config) => config.sellTime
  ),
  [types.PRODUCT_DESCRIPTION]: createFelid(
    source.poiFieldConfig,
    true,
    (config) => config.description
  ),
  [types.PRODUCT_PACK_BAG]: createFelid(
    source.poiFieldConfig,
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
    [source.poiHotRecommend, source.productCubeSwitch],
    false,
    ([hotRecommend, productCubeSwitch]) => !productCubeSwitch && hotRecommend,
    { needSourceLoaded: true }
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
  [types.POI_AUDIT_ENTRANCE]: createFelid(
    source.category,
    false,
    every(category => !isMedicineBusiness(category))
  ),
  [types.POI_SP_AUDIT_ENTRANCE]: createFelid(
    source.category,
    false,
    some(category => isMedicineBusiness(category))
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
  [types.BUSINESS_CATEGORY_TEMPLATE]: createFelid(
    [source.listPage, source.businessTemplate],
    false,
    ([listPage, businessTemplate]) => listPage.categoryTemplateGray && businessTemplate.exist
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
  ),
  // 使用了B端模版的门店，需要进行分类推荐
  [types.POI_RECOMMEND_TAG]: createFelid(
    source.businessTemplate,
    false,
    data => data.used
  ),
  // 没有使用B端模版的门店，新建商品的时候需要进行url上的tagId自动填充
  [types.POI_CREATE_PRODUCT_AUTO_FILL_TAG]: createFelid(
    source.businessTemplate,
    false,
    data => !data.used,
    { needSourceLoaded: true }
  ),
  [types.REL_POI_MAX_SIZE]: createFelid(
    source.poiSizeConfig,
    2000,
    max => max
  ),
  [types.POI_AUTO_CLEAR_STOCK]: createFelid(
    source.grayInfo,
    false,
    (grayInfo) => grayInfo.no_stock_auto_clear
  ),
  [types.PRODUCT_NAME_EXAMPLE]: createFelid(
    source.primaryCategory,
    '',
    (primaryCategory = {}) => getProductNameExample(primaryCategory)
  ),
  [types.MEDICINE_SP_APPLY]: createFelid(
    source.medicineSpApply,
    false,
    enabled => !!enabled
  ),
  // 门店审核状态
  [types.POI_AUDIT_STATUS]: createFelid(
    source.poiAuditInfo,
    undefined,
    data => data && data.status
  ),
  // 门店的审核信息
  [types.POI_AUDIT_INFO]: createFelid(
    source.poiAuditInfo,
    {},
    (auditInfo) => {
      const { status, title, description, rejectReason } = auditInfo
      if (!title && !description) {
        return AUDIT_INFO[status]
      }
      return { title, description, rejectReason }
    }
  ),
  /**
   * 商品魔方入口展示逻辑
   * 首先门店需要支持商品魔方功能
   * status: [待录入, 待提审, 审核驳回]
   * status: 审核通过 && 开门营业60天内
   */
  [types.POI_PRODUCT_CUBE_ENTRANCE]: createFelid(
    [source.poiAuditInfo, source.productCubeSwitch],
    false,
    ([poiAuditInfo, productCubeSwitch]) => {
      console.log('POI_PRODUCT_CUBE_ENTRANCE:', poiAuditInfo, productCubeSwitch)
      if (!productCubeSwitch) {
        return false
      }
      const { status, businessDays } = poiAuditInfo
      if (status === POI_AUDIT_STATUS.PASSED) {
        return businessDays < 60
      }
      return [
        POI_AUDIT_STATUS.NOT_ON_PROCESS,
        POI_AUDIT_STATUS.NOT_AUDITED,
        POI_AUDIT_STATUS.REJECTED,
        POI_AUDIT_STATUS.PENDING
      ].includes(status)
    }
  ),
  // 商品魔方入口下发信息
  [types.POI_PRODUCT_CUBE_INFO]: createFelid(
    source.productCubeInfo,
    { description: '', title: '' }
  )
}

export default module
