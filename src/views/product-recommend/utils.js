import { QUALIFICATION_STATUS } from '@/data/enums/product'

/**
 * 商品是否超出门店经营范围或者门店缺少资质判断
 */
export function getProductQualificationStatus (item) {
  if (item.qualificationStatus === QUALIFICATION_STATUS.NO || item.qualificationStatus === QUALIFICATION_STATUS.EXP || item.qualificationStatus === QUALIFICATION_STATUS.NOT_ALLOWED) {
    return item.qualificationStatus
  } else {
    return null
  }
}

export const isProductQualificationNotValid = (item) => !!getProductQualificationStatus(item)

/**
 * 选择的商品分类map转化为已选商品列表
 */
export function objToArray (obj) {
  return Object.values(obj).reduce((a, b) => { a.push(...b.productList); return a }, [])
}

/**
 * 已选商品map转换为按tag顺序的数组
 */
export const covertObjectToSequenceArr = (obj) => {
  return Object.entries(obj).sort(
    (a, b) => a[1].sequence - b[1].sequence)
}

export const isEmptyArray = (array) => !array || array.length === 0

export const getUniqueId = (item) => item.__id__

export const arrayToMap = (list) => {
  return list.reduce((prev, item) => {
    const id = getUniqueId(item)
    prev[id] = item
    return prev
  }, {})
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

export const getIndex = (list, item, getKey = (i) => i) => {
  return list.findIndex(i => {
    return getKey(i) === getKey(item)
  })
}

export const arrayUniquePush = (list, item, getKey = (i) => i) => {
  const index = getIndex(list, item, getKey = (i) => i)
  if (index < 0) {
    list.push(item)
  }
  return list
}

export const arrayUniquePop = (list, item, getKey = (i) => i) => {
  const index = getIndex(list, item, getKey)
  if (index >= 0) {
    list.splice(index, 1)
  }
  return list
}

// 合并商品信息
export const mergeProduct = (cacheProduct, product) => {
  let newSkuList = product.skuList || []
  if (cacheProduct.skuList) {
    const cacheSkuMap = arrayToMap(cacheProduct.skuList)
    newSkuList = newSkuList.map(item => {
      const id = getUniqueId(item)
      const cache = cacheSkuMap[id] || {}
      return { ...item, ...cache }
    })
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

// 获取checkbox的勾选状态 全选还是半选择
export const getCheckboxSelectStatus = (productList, selectIdList) => {
  let value = true
  let indeterminate = false
  productList.forEach(product => {
    const id = getUniqueId(product)
    const includes = selectIdList.includes(id)
    if (!includes) {
      value = false
    } else if (!indeterminate) {
      indeterminate = true
    }
  })
  return { value, indeterminate }
}

export const getGroupDataTotal = (groupData) => {
  return groupData.reduce((prev, { productList }) => prev + productList.length, 0)
}

export const getPaginationRange = (pagination) => {
  const { current, pageSize, total } = pagination
  const start = (current - 1) * pageSize
  const end = Math.min(current * pageSize, total)
  return [start, end]
}
// 按照分页 分割 分类聚合的商品
export const splitTagGroupProductByPagination = (groupData, pagination) => {
  const [start, end] = getPaginationRange(pagination)
  const result = []
  let count = 0
  for (let i = 0, l = groupData.length; i < l; i++) {
    if (count >= end) {
      return result
    }
    const { productList, ...rest } = groupData[i]
    const size = productList.length
    if (count + size > start) {
      const sliceStart = Math.max(0, start - count)
      const sliceEnd = Math.min(end - count, size)
      const newList = productList.slice(sliceStart, sliceEnd)
      count += productList.length
      result.push({ ...rest, productList: newList })
    } else {
      count += size
    }
  }
  return result
}
// 在分类聚合的商品中
export const findProductListInTagGroupProductById = (groupData, idList, getProduct) => {
  const result = []
  for (let i = 0, l = groupData.length; i < l; i++) {
    const { productList } = groupData[i]
    productList.forEach(p => {
      const id = getUniqueId(p)
      if (idList.includes(id)) {
        result.push(getProduct(p))
      }
    })
  }
  return result
}
