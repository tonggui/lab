import { splitCategoryAttrMap } from '@/views/components/product-form/data'
import { ATTR_TYPE, RENDER_TYPE } from '@/data/enums/category'
import { isEqual, get } from 'lodash'

export const getAttributes = (product) => {
  const { categoryAttrList, categoryAttrValueMap } = product
  return splitCategoryAttrMap(categoryAttrList, categoryAttrValueMap)
}

export const keyAttrsDiff = (oldData, newData) => {
  // const newData = this.productInfo
  // const oldData = this.originalFormData
  // upcCode不一致
  if (newData.upcCode !== oldData.upcCode) return true

  // category不一致
  if ((!newData.category && oldData.category) ||
    (newData.category && !oldData.category) ||
    (newData.category.id !== oldData.category.id)) return true

  // 关键属性不一致
  let isSpecialAttrEqual = true
  const { normalAttributes = [], normalAttributesValueMap = {} } = newData
  const { normalAttributesValueMap: oldNormalAttributesValueMap = {} } = oldData
  for (let i = 0; i < normalAttributes.length; i++) {
    const attr = normalAttributes[i]
    if (attr.attrType === ATTR_TYPE.SPECIAL) {
      if (attr.render.type === RENDER_TYPE.CASCADE || attr.render.type === RENDER_TYPE.BRAND) {
        if (!isEqual(get(normalAttributesValueMap, '[attr.id].idPath'), get(oldNormalAttributesValueMap, '[attr.id].idPath'))) {
          isSpecialAttrEqual = false
          break
        }
      } else {
        if (!isEqual(normalAttributesValueMap[attr.id], oldNormalAttributesValueMap[attr.id])) {
          isSpecialAttrEqual = false
          break
        }
      }
    }
  }
  return !isSpecialAttrEqual
}
