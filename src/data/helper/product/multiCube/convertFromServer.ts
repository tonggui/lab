import { MultiCubeProduct, CellularProductSku } from '@/data/interface/product'
import { convertProductSkuList } from '../withCategoryAttr/convertFromServer'
import { QUALIFICATION_STATUS } from '../../../enums/product'
import { convertCategoryTemplateTag } from '../../category/convertFromServer'

// 后端返回的算法推荐的商品信息 是拍平的信息，没有skus，需要自己组合一下
export const convertMultiCubeProduct = (product): MultiCubeProduct => {
  const { spec, price, unit, weight, weightUnit, stock, upcCode, skuAttrs } = product
  const skus = [{
    spec, price, unit, weight, weightUnit, stock, upcCode, skuAttrs
  }]
  return convertMultiCubeEditProduct({
    ...product,
    skus
  })
}

export const convertMultiCubeProductList = (list: MultiCubeProduct[], tabId: string = '', tagSource: number = 0) => (list || []).map(convertMultiCubeProduct).map(product => {
  product.tabId = tabId
  product.tagSource = tagSource
  return product
})
export const convertMultiCubeEditProduct = (product): MultiCubeProduct => {
  const {
    isExist,
    poiSpuId,
    name,
    tagList,
    isSp,
    spId,
    skus,
    picture,
    upcCode,
    retailPrice,
    lockStatus,
    lockTips,
    sourceLabelIds,
    sourceLabel,
    isDelete,
    labelVo,
    isHqExist,
    relatedPoiIds,
    totalPoiIds
  } = product
  let skuList = (convertProductSkuList(skus)) as CellularProductSku[]
  if (!poiSpuId) {
    skuList = skuList.map(s => {
      const sku:CellularProductSku = {
        ...s,
        price: { ...s.price, value: undefined, defaultValue: retailPrice > 0 ? retailPrice : undefined },
        stock: undefined
      }
      return sku
    })
  }
  const list = convertCategoryTemplateTag(typeof tagList === 'string' ? JSON.parse(tagList) : tagList)
  const multiCubeProduct: MultiCubeProduct = {
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
    productLabelIdList: sourceLabelIds || [sourceLabel],
    isDelete: isDelete === 1,
    hotSaleDetailsMap: labelVo,
    isExist: Number(isExist) === 1,
    isHqExist: isHqExist === 1,
    relatedPoiIds,
    totalPoiIds
  }
  return multiCubeProduct
}

export const convertMultiCubeEditProductList = (list) => (list || []).map(convertMultiCubeEditProduct)
