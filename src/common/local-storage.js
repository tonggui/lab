import Vue from 'vue'

export const KEYS = {
  // 搜索记录存储
  SEARCH_SUGGEST_HISTORY: 'searchHistoryList',
  // 门店选择 分页 pageSize 存储
  POI_SELECT_PAGE_SIZE: 'poiSelectPageSize',
  // 商家商品中心 列表页 pageSize 存储
  MERCHANT_PRODUCT_LIST: 'merchantProductList',
  // 医药发热商品登记 列表页 pageSize 存储
  MEDICINE_REGISTER_LIST: 'medicineRegisterList',
  // 热卖推荐 存储
  HOT_RECOMMEND: 'ignoreHotRecommend',
  // 取消置顶 分类 提示
  CATEGORY_REMOVE_TIP: 'checkedRemoveFromTopTip',
  // 添加置顶 分类 提示
  CATEGORY_ADD_TIP: 'checkedAddTopTip',
  // 管理分类 提示
  CATEGORY_SORT_TIP: 'newFunctionOfSortPrompt',
  // 智能分类开关 提示
  CATEGORY_SMART_SORT: 'checkedSmartSortSwitchTip',
  // 分类模版 入口 提示
  CATEGORY_TEMPLATE_ENTRANCE_TIP: 'categoryTemplateEntranceTip',
  CATEGORY_MAX_FIRST_LEVEL_TIP: 'categoryMaxFirstLevelTip',
  VIDEO_CENTER_ENTRANCE_BADGE: 'newBadgeOfVideoCenter',
  VIDEO_CENTER_ENTRANCE_TIP: 'newFunctionOfVideoPrompt',
  CATEGORY_TEMPLATE_MODAL: 'categoryTemplateModal',
  // 从商品库创建tab
  SP_LIST_TAB: 'spListTab',
  UNAPPROVE_PRODUCT_ENTRANCE_TIP: 'unApproveProductTip',
  TABLE_HEADER_REL_POI_TIP: 'tableHeaderRelPoiTip',
  MONITOR_MODAL: 'monitorModal',
  CELLUAR_PRODUCT_MATCH_MODAL: 'celluarProductMatchModal',
  // 门店 审核 引导弹框
  POI_AUDIT_GUIDE_MODAL: 'poiAuditGuideModal',
  // 商品缺失关键信息引导弹窗
  PRODUCT_MISSING_INFORMATION: 'productMissingInfo',
  MERCHANT_PRODUCT_MISSING_INFORMATION: 'merchantProductMissingInfo',
  // 商品上新推荐入口(魔方二期) 引导
  PRODUCT_NEW_ARRIVAL_GUIDE: 'productNewArrivalGuide',
  // 商品上新推荐编辑页面自动填写分类弹窗(魔方二期)
  PRODUCT_NEW_ARRIVAL_AUTO_FILL: 'productNewArrivalAutoFill',
  // 新批量关联引导提示
  NEW_BATCH_REL_GUIDE: 'newBatchRelGuide',
  BATCH_IMPORT_TIP: 'batchImportTip',
  // 商品设置中商品推广弹窗
  PRODUCT_SETTING_PROMOTION: 'productPromotion',
  // 单店-商品列表-商品配置
  PRODUCT_LIST_SETTING: 'productListSetting',
  // 单店-商品列表-商品配置推广提示
  PRODUCT_LIST_PROMOTION: 'productListPromotion'
}

const storage = {}

Object.keys(KEYS).forEach((key) => {
  const keyString = KEYS[key]
  Object.defineProperty(storage, keyString, {
    enumerable: true,
    configurable: true,
    get () {
      const value = localStorage.getItem(keyString)
      if (value !== undefined) {
        let data = value
        try {
          data = JSON.parse(value)
        } catch (err) {}
        return data
      }
      return value
    },
    set (value) {
      const encodeValue = JSON.stringify(value)
      localStorage.setItem(keyString, encodeValue)
    }
  })
})

export default Vue.observable(storage)
