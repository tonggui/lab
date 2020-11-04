import { NewArrivalProduct, Category } from '@/data/interface/product'
import { convertProductSkuList } from '../withCategoryAttr/convertToServer'
import { convertCategoryTemplateTag } from '../../category/convertToServer'
/**
 * TODO
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
    firstCategoryId: category.firstCategoryId,
    secondCategoryId: category.secondCategoryId,
    thirdCategoryId: category.thirdCategoryId,
    firstCategoryName: category.firstCategoryName,
    secondCategoryName: category.secondCategoryName,
    thirdCategoryName: category.thirdCategoryName
  }
}

export const convertNewArrivalProductList = (list) => (list || []).map((item) => convertNewArrivalProduct(item))
