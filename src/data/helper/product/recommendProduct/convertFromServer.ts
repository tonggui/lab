import { RecommendProduct, CellularProductSku } from '@/data/interface/product'
import { convertProductSkuList } from '../withCategoryAttr/convertFromServer'
import { QUALIFICATION_STATUS } from '../../../enums/product'
import { convertCategoryTemplateTag } from '../../category/convertFromServer'

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
    lockStatus,
    lockTips
    // suggestedPrice
  } = product

  let skuList = (convertProductSkuList(skus)) as CellularProductSku[]
  if (!id) {
    skuList = skuList.map(s => {
      const sku:CellularProductSku = {
        ...s,
        price: { ...s.price, value: undefined },
        stock: undefined
      } 
      return sku
    })
  }

  const recommendProduct: RecommendProduct = {
    __id__: id || spId,
    id,
    name,
    qualificationStatus: lockStatus || QUALIFICATION_STATUS.YES,
    qualificationTip: lockTips || '',
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
