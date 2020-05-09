import { PRODUCT_SELL_STATUS } from '@/data/enums/product'
import { CellularProduct } from '@/data/interface/product'
import { convertProductSkuList } from '../withCategoryAttr/convertToServer'
/**
 * TODO
 */
export const convertCellularProduct = (product: CellularProduct) => {
  const tagList = (product.tagList || []).map(item => ({ tagId: item.id, tagName: item.name }))
  const skuList = product.skuList.filter(sku => sku.editable)
  const convertSkuList = convertProductSkuList(skuList)
  return {
    id: product.id || 0,
    name: product.name,
    tagList: JSON.stringify(tagList),
    isSp: product.spId ? (product.isSp ? 1 : 2) : 0,
    spId: product.spId,
    skus: JSON.stringify(convertSkuList),
    sellStatus: PRODUCT_SELL_STATUS.ON // 0-是，1-下
  }
}
