import {
  MedicineDetailProduct
} from '../../../interface/product'
import { convertLimitSale } from '../../common/convertToServer'
import { convertSellTime } from '../base/convertToServer'

function convertCategoryAttrValueMap (valueMap = {}) {
  const result = {}
  Object.keys(valueMap).map(k => {
    const val = valueMap[k]
    if (val !== undefined) { // 注意：值为undefined也就是valueMap中没有的值，保存时必须有值，否则只保存为空字符串会报错
      result[k] = { value: Array.isArray(val) ? val.join(',') : val }
    }
  })
  return result
}

export const convertProductDetail = (product: MedicineDetailProduct) => {
  const valueMap = convertCategoryAttrValueMap(product.categoryAttrValueMap || {})
  const node = {
    id: product.skuId,
    wmFoodSpuId: product.id,
    name: product.name,
    upcCode: product.upcCode,
    spec: product.spec,
    sourceFoodCode: product.sourceFoodCode,
    sellStatus: product.sellStatus,
    oriPrice: +product.suggestedPrice || 0,
    price: +product.price || 0,
    stock: +product.stock || 0,
    categoryId: product.category.id,
    picList: product.pictureList.map(pic => ({
      pic_large_url: pic
    })),
    tagList: product.tagList.filter(tag => !!tag.name).map(tag => {
      return {
        id: +tag.id > 0 ? tag.id : '',
        name: tag.name
      }
    }),
    limitSale: convertLimitSale(product.limitSale),
    shippingTimeX: convertSellTime(product.shippingTime),
    extendInfoMap: valueMap
  }
  return node
}