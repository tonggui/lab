import { NewArrivalProduct, CellularProductSku } from '@/data/interface/product'
import { convertProductSkuList } from '../withCategoryAttr/convertFromServer'
import { QUALIFICATION_STATUS } from '../../../enums/product'
import { convertCategoryTemplateTag } from '../../category/convertFromServer'

// 后端返回的算法推荐的商品信息 是拍平的信息，没有skus，需要自己组合一下
export const convertNewArrivalProduct = (product): NewArrivalProduct => {
  const { spec, price, unit, weight, weightUnit, stock, upcCode, skuAttrs } = product
  const skus = [{
    spec, price, unit, weight, weightUnit, stock, upcCode, skuAttrs
  }]
  return convertNewArrivalEditProduct({
    ...product,
    skus
  })
}

export const convertNewArrivalProductList = (list): NewArrivalProduct[] => (list || []).map(convertNewArrivalProduct)

export const convertNewArrivalEditProduct = (product): NewArrivalProduct => {
  const {
    poiSpuId,
    name,
    isSp,
    spId,
    skus,
    picture,
    upcCode,
    retailPrice,
    lockStatus,
    lockTips,
    sourceLabelIds,
    isDelete,
    tagList,
    firstCategoryId = '',
    firstCategoryName = '',
    secondCategoryId = '',
    secondCategoryName = '',
    thirdCategoryId = '',
    thirdCategoryName = '',
    labelVo
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
  const category = {
    firstCategoryId,
    firstCategoryName,
    secondCategoryId,
    secondCategoryName,
    thirdCategoryId,
    thirdCategoryName
  }
  const list = convertCategoryTemplateTag(typeof tagList === 'string' ? JSON.parse(tagList) : tagList)
  const recommendProduct: NewArrivalProduct = {
    __id__: Number(poiSpuId) || spId,
    id: poiSpuId,
    name,
    qualificationStatus: lockStatus || QUALIFICATION_STATUS.YES,
    qualificationTip: lockTips || '',
    tagList: list,
    category,
    isSp: isSp === 1,
    spId,
    skuList,
    pictureList: (picture || '').split(','),
    upcCode,
    productLabelIdList: sourceLabelIds,
    isDelete: isDelete === 1,
    hotValueInfo: labelVo
  }
  return recommendProduct
}

export const convertNewArrivalEditProductList = (list) => (list || []).map(convertNewArrivalEditProduct)
