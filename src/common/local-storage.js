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
  // 首次显示新建
  PRODUCT_NEW_CREATE: 'productNewCreate',
  // 新批量关联引导提示
  NEW_BATCH_REL_GUIDE: 'newBatchRelGuide',
  BATCH_IMPORT_TIP: 'batchImportTip',
  // 商品设置中商品推广弹窗
  PRODUCT_SETTING_PROMOTION: 'productPromotion',
  // 单店-商品列表-商品配置
  PRODUCT_LIST_SETTING: 'productListSetting',
  // 单店-商品列表-商品配置推广提示
  PRODUCT_LIST_PROMOTION: 'productListPromotion',
  // 商品中心是否已经开通
  MERCHANT_OPEN_STATUS: 'merchantOpenStatus',
  // 商家商品中心指导手册提示
  MERCHANT_GUIDE_BOOK: 'merchantGuideBook',
  // 商家商品中心新手引导
  MERCHANT_GUIDE: 'merchantGuide',
  // 商家商品中心新手引导 - 商品操作引导
  MERCHANT_OPERATION_GUIDE: 'merchantOperationGuide',
  // 开通商家中心通过自助开通还是分店导入开通
  MERCHANT_OPEN_WAY: 'merchantOpenWay',
  // 商家商品中心任务进度
  MERCHANT_TASK_PROCESS: 'merchantTaskProcess',
  // 商家中心欢迎提示
  MERCHANT_WELCOME: 'merchantWelcome',
  // 商家商品中心魔方范围默认开启
  MERCHANT_CUBE_RANGE_AUTO_SETTING: 'merchantCubeRangeAutoSetting',
  // 商家商品中心魔方结果页返回
  MERCHANT_CUBE_RESULT_TIP: 'merchantCubeResultTip'
}

export const orders = ['MERCHANT_GUIDE', 'MERCHANT_GUIDE_BOOK']

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
