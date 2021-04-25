import { TAG_SOURCE } from '@/data/enums/product'
import { get } from 'lodash'
import { getPriorityTag } from '@/views/product-recommend/utils'

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

export const getLxParams = (item) => {
  try {
    const { id, children = [] } = getPriorityTag(item.tagList || [])
    return {
      product_label_id: (Array.isArray(item.productLabelIdList) && item.productLabelIdList.join(',')) || '',
      spu_id: item.id || '',
      st_spu_id: item.spId || '',
      page_source: window.page_source || 0,
      category1_id: id || '',
      category2_id: get(getPriorityTag(children || []), 'id', ''),
      first_category_id: get(item, `category[${TAG_SOURCE.SYSTEM}][0].id`, ''),
      second_category_id: get(item, `category[${TAG_SOURCE.SYSTEM}][1].id`, ''),
      select_time: +new Date()
    }
  } catch (err) {
    return {
      product_label_id: '',
      spu_id: item.id || '',
      st_spu_id: item.spId || '',
      page_source: window.page_source || 0,
      category1_id: '',
      category2_id: '',
      first_category_id: '',
      second_category_id: '',
      select_time: +new Date()
    }
  }
}
