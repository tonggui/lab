import { NewArrivalProduct, Category } from '@/data/interface/product'
import { convertCategoryTemplateTag } from '../../category/convertToServer'
import { convertProductSkuList } from '../withCategoryAttr/convertToServer'
import { TAG_SOURCE } from '@/data/enums/product'
import { get } from 'lodash'

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
    picture: product.pictureList.join(','),
    upcCode: product.upcCode,
    productLabelIds: product.productLabelIdList || [],
    tabId: product.tabId,
    firstCategoryId: get(category[TAG_SOURCE.SYSTEM], '[0].id'),
    secondCategoryId: get(category[TAG_SOURCE.SYSTEM], '[1].id'),
    thirdCategoryId: get(category[TAG_SOURCE.SYSTEM], '[2].id'),
    firstCategoryName: get(category[TAG_SOURCE.SYSTEM], '[0].name'),
    secondCategoryName: get(category[TAG_SOURCE.SYSTEM], '[1].name'),
    thirdCategoryName: get(category[TAG_SOURCE.SYSTEM], '[2].name'),
    inPoiFirstCategoryId: get(category[TAG_SOURCE.CUSTOM], '[0].id'),
    inPoiFirstCategoryName: get(category[TAG_SOURCE.CUSTOM], '[0].name'),
    inPoiSecondCategoryId: get(category[TAG_SOURCE.CUSTOM], '[1].id'),
    inPoiSecondCategoryName: get(category[TAG_SOURCE.CUSTOM], '[1].name'),
    isExist: product.isExist ? 1 : 0,
    productStatus: product.productStatus
  }
}

export const convertNewArrivalProductList = (list) => (list || []).map((item) => convertNewArrivalProduct(item))
