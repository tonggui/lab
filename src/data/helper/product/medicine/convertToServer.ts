import {
  MedicineDetailProduct
} from '../../../interface/product'

function convertCategoryAttrValueMap (valueMap = {}) {
  const result = {}
  Object.keys(valueMap).map(k => {
    const val = valueMap[k]
    result[k] = { value: Array.isArray(val) ? val.join(',') : val }
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
    oriPrice: product.suggestedPrice,
    price: product.price,
    stock: product.stock,
    categoryId: product.category.id,
    picList: product.pictureList.map(pic => ({
      pic_large_url: pic
    })),
    tagList: product.tagList.filter(tag => !!tag.name).map(tag => {
      return {
        id: +tag.id > 0 ? tag.id : '',
        name: tag.name,
        code: tag.appTagCode,
        level: tag.level
      }
    }),
    extendInfoMap: valueMap
  }
  return node
}