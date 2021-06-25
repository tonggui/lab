import { MultiCubeProduct } from '@/data/interface/product'
import { convertCategoryTemplateTag } from '../../category/convertToServer'
import { convertProductSkuList } from '../withCategoryAttr/convertToServer'

/**
 * TODO
 */
export const convertMultiCubeProduct = (product: MultiCubeProduct) => {
  const tagList = convertCategoryTemplateTag(product.tagList || [])
  const skuList = product.skuList.filter(sku => sku.editable)
  const convertSkuList = convertProductSkuList(skuList)
  return {
    id: product.id || 0,
    name: product.name,
    tagList: tagList,
    isSp: product.spId ? (product.isSp ? 1 : 2) : 0,
    spId: product.spId,
    skus: convertSkuList,
    picture: product.pictureList.join(','),
    upcCode: product.upcCode,
    tabId: product.tabId,
    productLabelIds: product.productLabelIdList || [],
    isExist: product.isExist ? 1 : 0,
    isHqExist: product.isHqExist,
    relatedPoiIds: product.relatedPoiIds,
    totalPoiIds: product.totalPoiIds,
    addedPoiIds: product.relatingPoiIds
  }
}

export const convertMultiCubeProductList = (list) => (list || []).map((item) => convertMultiCubeProduct(item))

export const convertSaveCubeProductList = (list) => (list || []).map((item) => convertMultiCubeProduct(item))
