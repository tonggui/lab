import { isFunction } from 'lodash'
import { TYPE } from './constants'

export const FELID = {
  PRICE: 'price',
  STOCK: 'stock',
  WEIGHT: 'weight',
  NAME: 'name',
  SPECNAME: 'specName'
}

/**
 * 已有商品可编辑的字段：价格，库存，店内分类
 * 新商品可编辑的字段：
 * 标品：价格，库存，店内分类
 * 非标品：价格，库存，店内分类，重量，规格名称，标题
 */
const editableMap = {
  [TYPE.EXIST]: {
    [FELID.PRICE]: true,
    [FELID.STOCK]: true
  },
  [TYPE.NEW]: {
    [FELID.PRICE]: true,
    [FELID.STOCK]: true,
    [FELID.WEIGHT]: (product) => !product.isSp,
    [FELID.NAME]: (product) => !product.isSp,
    [FELID.SPECNAME]: (product) => !product.isSp
  },
  [TYPE.NEW_ARRIVAL_MIX]: {
    [FELID.PRICE]: true,
    [FELID.STOCK]: true,
    [FELID.WEIGHT]: (product) => !product.isExist && !product.isSp,
    [FELID.NAME]: (product) => !product.isExist && !product.isSp,
    [FELID.SPECNAME]: (product) => !product.isExist && !product.isSp
  },
  [TYPE.MERCHANT_CENTER]: {
    [FELID.PRICE]: true,
    [FELID.STOCK]: true,
    [FELID.WEIGHT]: (product) => product.isHqExist ? product.isHqExist : !product.isSp,
    [FELID.NAME]: (product) => product.isHqExist ? product.isHqExist : !product.isSp,
    [FELID.SPECNAME]: (product) => product.isHqExist ? product.isHqExist : !product.isSp
  }
}

export const getEditableByFelid = (felid, type, product) => {
  const map = editableMap[type] || {}
  let editable = map[felid]
  if (isFunction(editable)) {
    editable = editable(product)
  }
  return editable || false
}

export const getEditableFelidsMap = (type, product) => {
  const map = editableMap[type] || {}
  return Object.entries(map).reduce((prev, [felid, editable]) => {
    if (isFunction(editable)) {
      editable = editable(product)
    }
    prev[felid] = editable
    return prev
  }, {})
}
