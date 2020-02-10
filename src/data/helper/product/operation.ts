// import { guid } from '@utiljs/guid'
import {
  Sku
} from '../../interface/product'
import {
  WEIGHT_UNIT
} from '../../enums/product'
import {
  PRODUCT_MAX_PRICE
} from '../../constants/product'
import {
  CategoryAttr, CategoryAttrValue
} from '../../interface/category'

const defaultSku = {
  price: PRODUCT_MAX_PRICE
}

let skuIndex = 0
export const skuPrefix = 'customized_sku_'

export const createSku = (defaultMap: { [prop: string]: boolean } = {}): Sku => {
  const sku: Sku = {
    id: '',
    __id__: `${skuPrefix}${skuIndex++}`,
    specName: '',
    editable: true,
    price: {
      unit: '份',
      value: defaultMap.price ? defaultSku.price : undefined
    },
    weight: {
      value: undefined,
      unit: WEIGHT_UNIT.G,
      ignoreMax: false
    },
    stock: 0,
    box: {
      price: 0,
      count: 1
    },
    minOrderCount: 1,
    upcCode: '',
    sourceFoodCode: '',
    shelfNum: ''
  }
  return sku
}
let attrValueIndex = 0
export const attrValuePrefix = 'customized_attr_value_'
export const createAttrValue = (attr: CategoryAttr, name: string, index: number): CategoryAttrValue => {
  const node: CategoryAttrValue = {
    id: `${attrValuePrefix}${attrValueIndex++}`,
    name,
    isCustomized: true,
    sequence: index + 1,
    parentId: attr.id,
    parentName: attr.name,
    selected: false
  }
  return node
}
