import { CellularProduct } from '@/data/interface/product'
import { convertProductSkuList } from '../withCategoryAttr/convertFromServer'

export const convertCellularProduct = (product): CellularProduct => {
  const {
    id,
    name,
    tagList,
    isSp,
    spId,
    skus,
    pictureList,
    upcCode,
    monthSale
  } = product

  const cellularProduct: CellularProduct = {
    __id__: id || spId,
    id,
    name,
    tagList: (tagList || []).map(({ tagId, tagName }) => ({ id: tagId, name: tagName })),
    isSp: isSp === 1,
    spId,
    skuList: convertProductSkuList(skus),
    pictureList,
    upcCode,
    monthSale
  }
  return cellularProduct
}

export const convertCellularProductListFromServer = (list) => (list || []).map(convertCellularProduct)
