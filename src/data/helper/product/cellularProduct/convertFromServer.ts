import { CellularProduct, CellularProductSku } from '@/data/interface/product'
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

  let skuList = (convertProductSkuList(skus)) as CellularProductSku[]
  if (isNewProduct) {
    skuList = skuList.map(s => {
      const sku:CellularProductSku = {
        ...s,
        price: { ...s.price, value: undefined },
        stock: undefined
      } 
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

// export const convertRecommendProduct = (product, isNewProduct): CellularProduct => {
//   const {
//     id,
//     name,
//     tagInfoList,
//     isSp,
//     spId,
//     skus,
//     picture,
//     upcCode,
//     monthSale,
//     wmProductVideo,
//     suggestedPrice,
//     riseMax,
//     dropMax,
//     sellStatus
//   } = product

//   let skuList = (convertProductSkuList(skus)) as CellularProductSku[]
//   if (isNewProduct) {
//     skuList = skuList.map(s => {
//       const sku:CellularProductSku = {
//         ...s,
//         price: { ...s.price, value: undefined },
//         stock: undefined
//       } 
//       return sku
//     })
//   }

//   const cellularProduct: CellularProduct = {
//     __id__: id || spId,
//     id,
//     name,
//     tagList: (tagInfoList || []).map(({ tagId, tagName, sequence }) => ({ id: tagId, name: tagName, sequence })),
//     isSp: isSp === 1,
//     spId,
//     skuList,
//     pictureList: (picture || '').split(','),
//     upcCode,
//     monthSale,
//     video: convertProductVideoFromServer(wmProductVideo),
//     suggesredPriceMax: (suggestedPrice * riseMax * 100) / 100 || Infinity,
//     suggesredPriceMin: (suggestedPrice * dropMax * 100) / 100 || -Infinity,
//     sellStatus,
//   }
//   return cellularProduct
// }

export const convertCellularProductList = (list, isNewProduct) => (list || []).map((item) => convertCellularProduct(item, isNewProduct))

// export const convertRecommendProductList = (list, isNewProduct) => (list || []).map((item) => convertRecommendProduct(item, isNewProduct))
