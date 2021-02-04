import { TAG_SOURCE } from '@/data/enums/product'

/**
 * 获取已选商品店内分类id集合
 * @param obj
 */
export function getCategoryIdList (obj) {
  return Object.values(obj).reduce((a, b) => {
    const productList = b.productList || []
    const categoryIds = productList.map(item => item.category[TAG_SOURCE.SYSTEM][2].id)
    a.push(...categoryIds)
    return a
  }, [])
}

// 商品信息是否不完整
export const isIncompleteProductInfo = (product) => {
  const { name, skuList, tagList = [] } = product
  if (!name) {
    return true
  }
  if (!tagList || !tagList.length) return true

  const list = skuList.filter(sku => sku.editable)
  if (list.length <= 0) {
    return true
  }
  return list.some(sku => {
    const { price, stock, weight } = sku
    return [price.value, stock, weight.value].some(v => !v && v !== 0)
  })
}
