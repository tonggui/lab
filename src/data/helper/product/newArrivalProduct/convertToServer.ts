import { NewArrivalProduct, Category, CellularProductSku } from '@/data/interface/product'
import { convertCategoryTemplateTag } from '../../category/convertToServer'
import { convertProductSkuList } from '../withCategoryAttr/convertToServer'
import { TAG_SOURCE } from '@/data/enums/product'
import { get } from 'lodash'

export const transferSkuToFlat = (skuList: CellularProductSku[] = []) => {
  if (skuList.length > 0) {
    const { specName, price: { value: priceValue, unit: priceUnit }, weight: { value: weightValue, unit: weightUnit }, stock, upcCode, monthSale } = skuList[0]
    return {
      spec: specName, price: priceValue, unit: priceUnit, weight: weightValue, weightUnit, stock, upcCode, monthSale
    }
  }
  return {}
}

export const transferCategoryToFlat = (category) => {
  if (!category) return {}
  const [first, second, third] = category[TAG_SOURCE.SYSTEM]
  const [cusFirst, cusSecond] = category[TAG_SOURCE.CUSTOM]
  return {
    firstCategoryId: get(first, 'id'),
    secondCategoryId: get(second, 'id'),
    thirdCategoryId: get(third, 'id'),
    firstCategoryName: get(first, 'name'),
    secondCategoryName: get(second, 'name'),
    thirdCategoryName: get(third, 'name'),
    inPoiFirstCategoryId: get(cusFirst, 'id'),
    inPoiFirstCategoryName: get(cusFirst, 'name'),
    inPoiSecondCategoryId: get(cusSecond, 'id'),
    inPoiSecondCategoryName: get(cusSecond, 'name')
  }
}

/**
 * TODO 上新商品数据格式清洗
 */
export const convertNewArrivalProduct = (product: NewArrivalProduct) => {
  const tagList = convertCategoryTemplateTag(product.tagList || [])
  const skuList = product.skuList.filter(sku => sku.editable)
  const convertSkuList = convertProductSkuList(skuList)

  const { category = {} as Category } = product
  return {
    id: product.id || 0,
    name: product.name,
    tagList: tagList,
    isSp: product.spId ? (product.isSp ? 1 : 2) : 0,
    spId: product.spId,
    skus: convertSkuList,
    ...transferSkuToFlat(skuList),
    picture: product.pictureList.join(','),
    upcCode: product.upcCode,
    productLabelIds: product.productLabelIdList || [],
    tabId: product.tabId,
    ...transferCategoryToFlat(category),
    isExist: product.isExist ? 1 : 0,
    productStatus: product.productStatus
  }
}

export const convertNewArrivalProductList = (list) => (list || []).map((item) => convertNewArrivalProduct(item))
