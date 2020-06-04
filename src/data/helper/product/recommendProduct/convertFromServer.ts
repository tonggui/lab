import { RecommendProduct, CellularProductSku } from '@/data/interface/product'
import { convertProductSkuList } from '../withCategoryAttr/convertFromServer'
import { QUALIFICATION_STATUS } from '../../../enums/product'
import { convertCategoryTemplateTag } from '../../category/convertFromServer'

// 后端返回的算法推荐的商品信息 是拍平的信息，没有skus，需要自己组合一下
export const convertRecommendProduct = (product): RecommendProduct => {
  const { spec, price, unit, weight, weightUnit, stock, upcCode, skuAttrs } = product
  const skus = [{
    spec, price, unit, weight, weightUnit, stock, upcCode, skuAttrs
  }]
  return convertRecommendEditProduct({
    ...product,
    skus
  })
}

export const convertRecommendProductList = (list): RecommendProduct[] => (list || []).map(convertRecommendProduct)

export const convertRecommendEditProduct = (product): RecommendProduct => {
  const {
    poiSpuId,
    name,
    tagInfoList,
    isSp,
    spId,
    skus,
    picture,
    upcCode,
    suggestedPrice,
    lockStatus,
    lockTips,
    sourceLabelIds
    // suggestedPrice
  } = product

  let skuList = (convertProductSkuList(skus)) as CellularProductSku[]
  if (!poiSpuId) {
    skuList = skuList.map(s => {
      const sku:CellularProductSku = {
        ...s,
        price: { ...s.price, value: undefined, defaultValue: suggestedPrice > 0 ? suggestedPrice : undefined },
        stock: undefined
      } 
      return sku
    })
  }
  const list = convertCategoryTemplateTag(typeof tagInfoList === 'string' ? JSON.parse(tagInfoList) : tagInfoList)
  const recommendProduct: RecommendProduct = {
    __id__: Number(poiSpuId) || spId,
    id: poiSpuId,
    name,
    qualificationStatus: lockStatus || QUALIFICATION_STATUS.YES,
    qualificationTip: lockTips || '',
    tagList: list,
    isSp: isSp === 1,
    spId,
    skuList,
    pictureList: (picture || '').split(','),
    upcCode,
    productLabelIdList: sourceLabelIds
  }
  return recommendProduct
}

export const convertRecommendEditProductList = (list) => (list || []).map(convertRecommendEditProduct)
