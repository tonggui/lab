/**
 * 选择的商品分类map转化为已选商品列表
 */
export function objToArray (obj) {
  return Object.values(obj).reduce((a, b) => { a.push(...b.productList); return a }, [])
}

export const covertObjectToSequenceArr = (obj) => {
  return Object.entries(obj).sort(
    (a, b) => a[1].sequence - b[1].sequence)
}

export const isEmptyArray = (array) => !array || array.length === 0

export const arrayToMap = (list) => {
  return list.reduce((prev, item) => {
    prev[item.__id__] = item
    return prev
  }, {})
}

export const arrayMergeWithMap = (list, map) => {
  return list.map(item => {
    const cache = map[item.__id__] || {}
    return { ...item, ...cache }
  })
}

export const getPriorityTag = (tagList) => {
  let priorityTag = null
  tagList.forEach(tag => {
    if (!priorityTag || tag.sequence < priorityTag.sequence) {
      priorityTag = tag
    }
  })
  return priorityTag
}

export const getIndex = (list, item) => {
  return list.findIndex(i => {
    return i.__id__ === item.__id__
  })
}

export const arrayUniquePush = (list, item) => {
  const index = getIndex(list, item)
  if (index < 0) {
    list.push(item)
  }
  return list
}

export const arrayUniquePop = (list, item) => {
  const index = getIndex(list, item)
  if (index >= 0) {
    list.splice(index, 1)
  }
  return list
}

export const mergeProduct = (cacheProduct, product) => {
  let newSkuList = product.skuList || []
  if (cacheProduct.skuList) {
    const cacheSkuMap = arrayToMap(cacheProduct.skuList)
    newSkuList = arrayMergeWithMap(newSkuList, cacheSkuMap)
  }
  return { ...product, ...cacheProduct, skuList: newSkuList }
}
// 商品信息是否不完整
export const isIncompleteProductInfo = (product) => {
  const { name, skuList } = product
  if (!name) {
    return true
  }
  const list = skuList.filter(sku => sku.editable)
  if (list.length <= 0) {
    return true
  }
  return list.some(sku => {
    const { price, stock, weight } = sku
    return [price.value, stock, weight.value].some(v => !v && v !== 0)
  })
}
