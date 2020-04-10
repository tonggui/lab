import { CellularProduct } from '@/data/interface/product'
import { convertProductSkuList } from '../withCategoryAttr/convertFromServer'
import { convertProductVideoFromServer } from '../base/convertFromServer'

export const convertCellularProduct = (product): CellularProduct => {
  const {
    id,
    name,
    productTags,
    isSp,
    spId,
    skuVos,
    picture,
    upcCode,
    monthSale,
    wmProductVideo,
    suggestedPrice,
    riseMax,
    dropMax
  } = product

  const cellularProduct: CellularProduct = {
    __id__: id || spId,
    id,
    name,
    tagList: (productTags || []).map(({ tagId, tagName }) => ({ id: tagId, name: tagName })),
    isSp: isSp === 1,
    spId,
    skuList: convertProductSkuList(skuVos),
    pictureList: picture,
    upcCode,
    monthSale,
    video: convertProductVideoFromServer(wmProductVideo),
    suggesredPriceMax: (suggestedPrice * riseMax * 100) / 100 || undefined,
    suggesredPriceMin: (suggestedPrice * dropMax * 100) / 100 || undefined
  }
  return cellularProduct
}

export const convertCellularProductList = (list) => (list || []).map(convertCellularProduct)
