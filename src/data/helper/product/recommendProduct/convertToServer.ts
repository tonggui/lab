import { RecommendProduct } from '@/data/interface/product'
import { convertProductSkuList } from '../withCategoryAttr/convertToServer'
import { convertCategoryTemplateTag } from '../../category/convertToServer'
/**
 * TODO
 */
export const convertRecommendProduct = (product: RecommendProduct) => {
  const tagList = convertCategoryTemplateTag(product.tagList)
  const skuList = product.skuList.filter(sku => sku.editable)
  const convertSkuList = convertProductSkuList(skuList)
  return {
    id: product.id || 0,
    name: product.name,
    tagInfoList: tagList,
    isSp: product.spId ? (product.isSp ? 1 : 2) : 0,
    spId: product.spId,
    skus: convertSkuList,
    picture: product.pictureList.join(',')
  }
}

export const convertRecommendProductList = (list) => (list || []).map((item) => convertRecommendProduct(item))