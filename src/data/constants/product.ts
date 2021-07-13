import {
  WEIGHT_UNIT,
  PRODUCT_MARK,
  PRODUCT_STATUS,
  PRODUCT_SELL_STATUS,
  MERCHANT_PRODUCT_STATUS,
  NEW_ARRIVAL_PRODUCT_STATUS,
  MEDICINE_MERCHANT_PRODUCT_STATUS
} from '../enums/product'

export const WeightUnit = [
  { value: WEIGHT_UNIT.G, label: WEIGHT_UNIT.G },
  { value: WEIGHT_UNIT.KG, label: WEIGHT_UNIT.KG },
  { value: WEIGHT_UNIT.ML, label: WEIGHT_UNIT.ML },
  { value: WEIGHT_UNIT.L, label: WEIGHT_UNIT.L },
  { value: WEIGHT_UNIT.P, label: WEIGHT_UNIT.P },
  { value: WEIGHT_UNIT.JIN, label: WEIGHT_UNIT.JIN },
  { value: WEIGHT_UNIT.LIANG, label: WEIGHT_UNIT.LIANG }
]

// TODO
export const ProductUnit = [
  { value: '份', label: '份' },
  { value: '盒', label: '盒' },
  { value: '件', label: '件' },
  { value: '箱', label: '箱' },
  { value: '袋', label: '袋' },
  { value: '筐', label: '筐' },
  { value: '双', label: '双' },
  { value: '捆', label: '捆' },
  { value: '把', label: '把' },
  { value: '提', label: '提' },
  { value: '包', label: '包' },
  { value: '个', label: '个' }
]

export const ProductMark = {
  [PRODUCT_MARK.SUSPENDED_SALE]: {
    type: 'normal',
    name: '已下架'
  },
  [PRODUCT_MARK.RC_SUSPENDED_SALE]: {
    type: 'danger',
    name: '风控下架'
  },
  [PRODUCT_MARK.SOLD_OUT]: {
    type: 'danger',
    name: '已售罄'
  },
  [PRODUCT_MARK.PART_SOLD_OUT]: {
    type: 'danger',
    name: '部分售罄'
  },
  [PRODUCT_MARK.NEED_TO_FILL]: {
    type: 'normal',
    name: '需补充'
  },
  [PRODUCT_MARK.NEED_TO_CHECK]: {
    type: 'normal',
    name: '待更新'
  },
  [PRODUCT_MARK.MERCHANT_DELETE]: {
    type: 'normal',
    name: '总部删除'
  },
  [PRODUCT_MARK.AUDIT_REJECTED]: {
    type: 'danger',
    name: '审核驳回'
  },
  [PRODUCT_MARK.AUDITING]: {
    type: 'normal',
    name: '审核中'
  },
  [PRODUCT_MARK.PLATFORM_SUSPENDED_SALE]: {
    type: 'normal',
    name: '平台下架'
  },
  [PRODUCT_MARK.MISSING_INFORMATION]: {
    type: 'normal',
    name: '信息缺失'
  },
  [PRODUCT_MARK.MERCHANT_EXIST]: {
    type: 'normal',
    name: '总部已创建'
  }
}

// TODO 只有药品有商品优化
export const productStatus = [{
  id: PRODUCT_STATUS.ALL,
  key: 'all',
  name: '全部商品',
  count: 0
}, {
  id: PRODUCT_STATUS.SELLING,
  key: 'selling',
  name: '售卖中',
  count: 0
}, {
  id: PRODUCT_STATUS.SUSPENDED_SALE,
  key: 'suspendedSale',
  name: '已下架',
  count: 0
}, {
  id: PRODUCT_STATUS.SELL_OUT,
  key: 'sellOut',
  name: '已售罄',
  needDanger: true,
  count: 0
}, {
  id: PRODUCT_STATUS.INCOMPLETE,
  key: 'incomplete',
  name: '商品优化',
  needDanger: true,
  count: 0
}, {
  id: PRODUCT_STATUS.MISSING_INFORMATION,
  key: 'missingRequiredCount',
  name: '必填信息缺失',
  needDanger: true,
  count: 0,
  badge: true,
  tooltip: {
    type: 'guide',
    transfer: false,
    keyName: 'PRODUCT_MISSING_INFORMATION',
    content: '商品有必填字段还未填写，影响用户下单转化哦！请将商品缺失的信息补充完整'
  }
}]

export const merchantProductStatus = [{
  id: MERCHANT_PRODUCT_STATUS.ALL,
  key: 'all',
  name: '商家商品',
  count: 0
}, {
  id: MERCHANT_PRODUCT_STATUS.MISSING_INFORMATION,
  key: 'missingRequiredCount',
  name: '必填信息缺失',
  needDanger: true,
  count: 0,
  badge: true,
  tooltip: {
    type: 'guide',
    transfer: false,
    keyName: 'MERCHANT_PRODUCT_MISSING_INFORMATION',
    content: '商品有必填字段还未填写，影响用户下单转化哦！请将商品缺失的信息补充完整'
  }
}]

export const medicineMerchantProductStatus = [
  {
    id: MEDICINE_MERCHANT_PRODUCT_STATUS.ALL,
    key: 'all',
    name: '商家商品',
    count: 0
  },
  {
    id: MEDICINE_MERCHANT_PRODUCT_STATUS.INCOMPLETE,
    key: 'incomplete',
    name: '商品优化'
  },
  {
    id: MEDICINE_MERCHANT_PRODUCT_STATUS.COMPLETED,
    key: 'completed',
    name: '优化记录'
  }
  // {
  //   id: MEDICINE_MERCHANT_PRODUCT_STATUS.MISSING_INFORMATION,
  //   key: 'missingRequiredCount',
  //   name: '必填信息缺失',
  //   needDanger: true,
  //   count: 0,
  //   badge: true,
  //   tooltip: {
  //     type: 'guide',
  //     transfer: false,
  //     keyName: 'MERCHANT_PRODUCT_MISSING_INFORMATION',
  //     content: '商品有必填字段还未填写，影响用户下单转化哦！请将商品缺失的信息补充完整'
  //   }
  // }
]

export const defaultMedicineMerchantProductStatus = MEDICINE_MERCHANT_PRODUCT_STATUS.ALL

export const defaultMerchantProductStatus = MERCHANT_PRODUCT_STATUS.ALL

export const defaultProductStatus = PRODUCT_STATUS.ALL

export const PRODUCT_INFINITE_STOCK = -1

export const PRODUCT_MIN_STOCK = 0

export const PRODUCT_MAX_STOCK = 9999

export const MEDICINE_MAX_STOCK = 9999999

export const PRODUCT_MAX_PRICE = 30000

export const PRODUCT_MIN_PRICE = 0

export const PRODUCT_PRICE_PRECISION = 2

export const SELL_STATUS_STR = {
  [PRODUCT_SELL_STATUS.OFF]: '已下架',
  [PRODUCT_SELL_STATUS.ON]: '已上架'
}

export const PRODUCT_NAME_MAX_LENGTH = 30

export const PRODUCT_SPEC_NAME_MAX_LENGTH = 30

export const NEW_ARRIVAL_PRODUCT_STATUS_TEXT = {
  [NEW_ARRIVAL_PRODUCT_STATUS.OFFSHELF]: '已下架',
  [NEW_ARRIVAL_PRODUCT_STATUS.ONSALE]: '售卖中',
  [NEW_ARRIVAL_PRODUCT_STATUS.SOLDOUT]: '已售罄'
}

export const PRODUCT_CORRECT_IFRAME_URL = 'https://shangou.meituan.net/v1/mss_24c1e05b968a4937bf34e2f4ff68639e/shangou-fe-maker-html/sg/html/1609728746797_9266df/index.html'
