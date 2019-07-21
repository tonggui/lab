// import { guid } from '@utiljs/guid'
import {
  Sku
} from '../../interface/product'
import {
  WEIGHT_UNIT
} from '../../enums/product'
import {
  CategoryAttr, CategoryAttrValue
} from '../../interface/category'

let skuIndex = 0

const initSku: Sku = {
  id: '',
  specName: '',
  editable: true,
  price: {
    unit: '份',
    value: undefined
  },
  weight: {
    value: undefined,
    unit: WEIGHT_UNIT.G
  },
  stock: 0,
  box: {
    price: 0,
    count: 1
  }
}

export const createSku = (): Sku => {
  return { ...initSku, id: `customized_sku_${skuIndex++}` }
}
let attrValueIndex = 0
export const createAttrValue = (attr: CategoryAttr, name: string, index: number): CategoryAttrValue => {
  const node: CategoryAttrValue = {
    id: `customized_attr_value_${attrValueIndex}`,
    name,
    isCustomized: true,
    sequence: index,
    parentId: attr.id,
    parentName: attr.name,
    selected: false
  }
  return node
}
