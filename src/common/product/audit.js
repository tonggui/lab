import { filter, get, intersectionBy, isEqual, trim } from 'lodash'
import { ATTR_TYPE, RENDER_TYPE } from '@/data/enums/category'

/**
 * 计算SKU中的UPC是否被全部修改（空upc的sku不参与计算）
 * 修改后数据中不包含修改前的UPC
 * 修改前规格无UPC，修改后存在有UPC的SKU
 * @return {boolean}
 */
export const diffSkuByUpc = (oldList, newList) => {
  const skuListWithUpcNew = filter(newList, sku => !!trim(get(sku, 'upcCode')))
  const skuListWithUpcOld = filter(oldList, sku => !!trim(get(sku, 'upcCode')))

  return (skuListWithUpcNew.length || skuListWithUpcOld.length) &&
    intersectionBy(skuListWithUpcNew, skuListWithUpcOld, 'upcCode').length === 0
}

export const diffCategory = (oldCategory, newCategory) =>
  (!newCategory && oldCategory) ||
  (newCategory && !oldCategory) ||
  (newCategory.id !== oldCategory.id)

export const diffCategoryAttrs = (oldData, newData) => {
  // 关键属性不一致
  let isSpecialAttrEqual = true
  const { normalAttributes = [], normalAttributesValueMap = {} } = newData
  const { normalAttributesValueMap: oldNormalAttributesValueMap = {} } = oldData
  for (let i = 0; i < normalAttributes.length; i++) {
    const attr = normalAttributes[i]
    if (attr.attrType === ATTR_TYPE.SPECIAL) {
      if (attr.render.type === RENDER_TYPE.CASCADE || attr.render.type === RENDER_TYPE.BRAND) {
        if (!isEqual(get(normalAttributesValueMap, `[${attr.id}].idPath`), get(oldNormalAttributesValueMap, `[${attr.id}].idPath`))) {
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

export const diffKeyAttrs = (oldData, newData) =>
  diffSkuByUpc(get(oldData, 'skus'), get(newData, 'skus')) ||
  diffCategory(get(oldData, 'category'), get(newData, 'category')) ||
  diffCategoryAttrs(oldData, newData)
