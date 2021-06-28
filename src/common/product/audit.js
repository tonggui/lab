import { filter, get, intersectionBy, isEqual, sortBy, trim } from 'lodash'
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

export const diffSkuBySpec = (oldList, newList) => {
  const skuListWithSpecNew = filter(newList, sku => {
    if (trim(get(sku, 'specName'))) {
      sku.specName = trim(sku.specName)
      return sku
    }
  })
  const skuListWithSpecOld = filter(oldList, sku => {
    if (trim(get(sku, 'specName'))) {
      sku.specName = trim(sku.specName)
      return sku
    }
  })
  return (skuListWithSpecNew.length || skuListWithSpecOld.length) &&
    intersectionBy(skuListWithSpecNew, skuListWithSpecOld, 'specName').length === 0
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

export const diffCategoryKeyAttrsNums = (oldData, newData) => {
  // 关键属性数量不一致
  const { normalAttributes = [] } = newData
  const { normalAttributes: oldNormalAttributes = [] } = oldData
  const oldKeyAttrsNums = oldNormalAttributes.filter(attr => attr.attrType === ATTR_TYPE.SPECIAL).length
  const newKeyAttrsNums = normalAttributes.filter(attr => attr.attrType === ATTR_TYPE.SPECIAL).length
  return oldKeyAttrsNums !== newKeyAttrsNums
}

const dataType = data => Object.prototype.toString.call(data).match(/\[object (.*?)\]/)[1].toLowerCase()
const isSkuKey = (skuList, key) => skuList.some(sku => Object.keys(sku).includes(key))
const skuIsEqual = (old, newN, key) => !old.every((o, i) => {
  const oldItem = o[key]
  const newItem = get(newN, `${i}.${key}`)
  if (dataType(oldItem) === 'object') {
    // 会有数字和字符串比较的问题
    return Object.keys(oldItem).every(k => dataType(oldItem[k]) === 'number' ? oldItem[k] === +newItem[k] : oldItem[k] === newItem[k])
  }
  return isEqual(oldItem, newItem)
})

export const diffCommon = (oldData, newData, depList = []) => {
  return depList.some(key => {
    const realKey = isSkuKey(get(newData, 'skuList'), key) ? 'skuList' : key
    let old = get(oldData, realKey)
    let newN = get(newData, realKey)
    if (key === 'attributeList') {
      return diffCategoryAttrs(oldData, newData)
    }
    if (realKey === 'skuList') {
      old = sortBy(old, o => o.id)
      newN = sortBy(newN, o => o.id)
      // sku特殊处理
      return skuIsEqual(old, newN, key)
    }
    return !isEqual(old, newN)
  })
}

export const diffKeyAttrs = (oldData, newData) =>
  diffSkuByUpc(get(oldData, 'skuList'), get(newData, 'skuList')) ||
  diffCategory(get(oldData, 'category'), get(newData, 'category')) ||
  diffCategoryAttrs(oldData, newData)

export const sameCategoryAndCategoryAttrs = (oldData, newData) => {
  return !diffCategory(get(oldData, 'category'), get(newData, 'category')) &&
  !diffCategoryAttrs(oldData, newData) && !diffCategoryKeyAttrsNums(oldData, newData)
}
