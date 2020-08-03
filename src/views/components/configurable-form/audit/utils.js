import { get } from 'lodash'
import { ATTR_TYPE } from '@/data/enums/category'

export const needCorrectionAudit = (product, originalProduct) => {
  // upcCode, category, 关键属性
  if (product.upcCode !== originalProduct.upcCode) {
    return true
  }
  if (get(product, 'category.id') !== get(originalProduct, 'category.id')) {
    return true
  }
  const attrList = product.categoryAttrList
  if (attrList.length > 0) {
    return attrList.some(({ id, type }) => {
      if (type !== ATTR_TYPE.SPECIAL) {
        return false
      }
      return get(product, `categoryAttrValueMap[${id}]`) !== get(originalProduct, `categoryAttrValueMap[${id}]`)
    })
  }
  return false
}
