import Vue from 'vue'

export const KEYS = {
  // 搜索记录存储
  SEARCH_SUGGEST_HISTORY: 'searchHistoryList',
  // 门店选择 分页 pageSize 存储
  POI_SELECT_PAGE_SIZE: 'poiSelectPageSize',
  // 商家商品中心 列表页 pageSize 存储
  MERCHANT_PRODUCT_LIST: 'merchantProductList',
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
  TABLE_HEADER_REL_POI_TIP: 'tableHeaderRelPoiTip'
}

const storage = {}

for (let key in KEYS) {
  Object.defineProperty(storage, KEYS[key], {
    enumerable: true,
    configurable: true,
    get () {
      const value = localStorage.getItem(KEYS[key])
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
      localStorage.setItem(KEYS[key], encodeValue)
    }
  })
}

export default Vue.observable(storage)
