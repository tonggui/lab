import { CellularProduct } from '@/data/interface/product'
import { convertProductSkuList } from '../withCategoryAttr/convertFromServer'
import { convertProductVideoFromServer } from '../base/convertFromServer'

export const convertCellularProduct = (product, isNewProduct): CellularProduct => {
  const {
    id,
    name,
    tagList,
    isSp,
    spId,
    skus,
    picture,
    upcCode,
    monthSale,
    wmProductVideo,
    suggestedPrice,
    riseMax,
    dropMax,
    sellStatus
  } = product

  let skuList = convertProductSkuList(skus)
  if (isNewProduct) {
    skuList = skuList.map(sku => {
      sku.price.value = undefined
      return sku
    })
  }

  const cellularProduct: CellularProduct = {
    __id__: id || spId,
    id,
    name,
    tagList: (tagList || []).map(({ tagId, tagName }) => ({ id: tagId, name: tagName })),
    isSp: isSp === 1,
    spId,
    skuList,
    pictureList: (picture || '').split(','),
    upcCode,
    monthSale,
    video: convertProductVideoFromServer(wmProductVideo),
    suggesredPriceMax: (suggestedPrice * riseMax * 100) / 100 || Infinity,
    suggesredPriceMin: (suggestedPrice * dropMax * 100) / 100 || -Infinity,
    sellStatus,
  }
  return cellularProduct
}

export const convertCellularProductList = (list, isNewProduct) => (list || []).map((item) => convertCellularProduct(item, isNewProduct))
