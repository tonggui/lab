import { RecommendProduct, CellularProductSku } from '@/data/interface/product'
import { convertProductSkuList } from '../withCategoryAttr/convertFromServer'
import { convertCategoryTemplateTag } from '../../category/convertFromServer'
import defaultTo from 'lodash/defaultTo'

export const convertRecommendProduct = (product): RecommendProduct => {
  const {
    id,
    name,
    tagInfoList,
    isSp,
    spId,
    skus,
    picture,
    upcCode,
    suggestedPrice
  } = product

  let skuList = (convertProductSkuList(skus)) as CellularProductSku[]
  if (!id) {
    skuList = skuList.map(s => {
      const sku:CellularProductSku = {
        ...s,
        price: { ...s.price, value: undefined, defaultValue: defaultTo(suggestedPrice, undefined) },
        stock: undefined
      } 
      return sku
    })
  }

  const recommendProduct: RecommendProduct = {
    __id__: id || spId,
    id,
    name,
    tagList: convertCategoryTemplateTag(tagInfoList),
    isSp: isSp === 1,
    spId,
    skuList,
    pictureList: (picture || '').split(','),
    upcCode
  }
  return recommendProduct
}

export const convertRecommendProductList = (list) => (list || []).map((item) => convertRecommendProduct(item))
