import { CellularProduct } from '@/data/interface/product'
import { convertProductSkuList } from '../withCategoryAttr/convertToServer'
/**
 * TODO
 */
export const convertCellularProduct = (product: CellularProduct) => {
  return {
    id: product.id || 0,
    name: product.name,
    productTags: (product.tagList || []).map(item => ({ tagId: item.id, tagName: item.name })),
    isSp: product.spId ? (product.isSp ? 1 : 2) : 0,
    spId: product.spId,
    skus: convertProductSkuList(product.skuList),
    sellStatus: 1 // 1-是，2-否
  }
}
