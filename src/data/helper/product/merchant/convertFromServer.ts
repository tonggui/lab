import {
  MerchantProduct,
} from '../../../interface/product'

export const convertMerchantProduct = (product: any): MerchantProduct => {
  const { spuId, name, priceRange, poiCount, pictures, ctime, sequence } = product
  const node: MerchantProduct = {
    id: spuId,
    name,
    priceRange,
    poiCount,
    pictureList: pictures,
    picture: (pictures || [])[0],
    ctime,
    sequence
  }
  return node
}

export const convertMerchantProductList = (list: any[]): MerchantProduct[] => {
  list = list || []
  return list.map(convertMerchantProduct)
}