import {
  PRODUCT_SELL_STATUS,
  PRODUCT_STOCK_STATUS
} from '@/data/enums/product'

export const EXIST_TYPE = {
  INCLUDE: 0,
  EXCLUDE: 1
}

export const existOptions = [{
  label: '有此商品',
  value: EXIST_TYPE.INCLUDE
}, {
  label: '无此商品',
  value: EXIST_TYPE.EXCLUDE
}]

export const statusOptions = [{
  label: '全部',
  value: PRODUCT_SELL_STATUS.ALL
}, {
  label: '上架',
  value: PRODUCT_SELL_STATUS.ON
}, {
  label: '下架',
  value: PRODUCT_SELL_STATUS.OFF
}]

export const stockOptions = [{
  label: '全部',
  value: PRODUCT_STOCK_STATUS.ALL
}, {
  label: '有库存',
  value: PRODUCT_STOCK_STATUS.IN
}, {
  label: '无库存',
  value: PRODUCT_STOCK_STATUS.OUT
}]

export const defaultData = {
  poiId: '',
  exist: EXIST_TYPE.INCLUDE,
  sellStatus: PRODUCT_SELL_STATUS.ALL,
  stockStatus: PRODUCT_STOCK_STATUS.ALL,
  minPrice: undefined,
  maxPrice: undefined
}
