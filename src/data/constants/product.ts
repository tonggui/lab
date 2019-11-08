import {
  WEIGHT_UNIT,
  PRODUCT_MARK,
  PRODUCT_STATUS,
  PRODUCT_SELL_STATUS
} from '../enums/product'

export const WeightUnit = [
  { value: WEIGHT_UNIT.G, label: WEIGHT_UNIT.G },
  { value: WEIGHT_UNIT.KG, label: WEIGHT_UNIT.KG },
  { value: WEIGHT_UNIT.ML, label: WEIGHT_UNIT.ML },
  { value: WEIGHT_UNIT.L, label: WEIGHT_UNIT.L },
  { value: WEIGHT_UNIT.P, label: WEIGHT_UNIT.P }
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
}]

export const defaultProductStatus = PRODUCT_STATUS.ALL

export const PRODUCT_INFINITE_STOCK = -1

export const PRODUCT_MAX_STOCK = 999

export const PRODUCT_MAX_PRICE = 30000

export const PRODUCT_MIN_PRICE = 0

export const PRODUCT_PRICE_PRECISION = 2

export const getInitRules = () => ({
  // 非标品可编辑状态
  editable: {
    upc: true,
    title: true, // 非标品的标题默认不可编辑
    brand: true,
    category: true,
    weight: true,
    weightUnit: true,
    unit: true,
    spec: true
  },
  // 标品可编辑状态
  spEditable: {
    upc: true,
    title: true,
    brand: true,
    category: true,
    weight: true,
    weightUnit: true,
    unit: true,
    spec: true
  },
  // 字段是否必填
  required: {
    upc: false,
    title: true,
    brand: false,
    category: true,
    weight: true,
    weightUnit: true,
    unit: false,
    spec: false
  }
})


export const SELL_STATUS_STR = {
  [PRODUCT_SELL_STATUS.OFF]: '已下架',
  [PRODUCT_SELL_STATUS.ON]: '已上架'
}
