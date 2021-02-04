import { NewArrivalProduct, CellularProductSku } from '@/data/interface/product'
import { convertProductSkuList } from '../withCategoryAttr/convertFromServer'
import { QUALIFICATION_STATUS, TAG_SOURCE } from '../../../enums/product'
import { convertCategoryTemplateTag } from '../../category/convertFromServer'

// 后端返回的算法推荐的商品信息 是拍平的信息，没有skus，需要自己组合一下
export const convertNewArrivalProduct = (product): NewArrivalProduct => {
  const { spec, price, unit, weight, weightUnit, stock, upcCode, monthSale, skus = [] } = product
  const skuList = skus && skus.length ? skus : [{
    spec, price, unit, weight, weightUnit, stock, upcCode, monthSale
  }]
  return convertNewArrivalEditProduct({
    ...product,
    skus: skuList
  })
}

export const convertNewArrivalProductList = (list: NewArrivalProduct[], tabId: string = '') => (list || []).map(convertNewArrivalProduct).map(product => {
  product.tabId = tabId
  return product
})

export const convertNewArrivalEditProduct = (product): NewArrivalProduct => {
  const {
    isExist,
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
    firstCategorySequence = 0,
    secondCategoryId = '',
    secondCategoryName = '',
    thirdCategoryId = '',
    thirdCategoryName = '',
    inPoiFirstCategoryId = '',
    inPoiFirstCategoryName = '',
    inPoiSecondCategoryId = '',
    inPoiSecondCategoryName = '',
    inPoiFirstCategorySequence = 0,
    labelVo,
    productStatus
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
    [TAG_SOURCE.SYSTEM]: [{ id: firstCategoryId, name: firstCategoryName }, { id: secondCategoryId, name: secondCategoryName }, { id: thirdCategoryId, name: thirdCategoryName }],
    [TAG_SOURCE.CUSTOM]: [{ id: inPoiFirstCategoryId, name: inPoiFirstCategoryName }, { id: inPoiSecondCategoryId, name: inPoiSecondCategoryName }]
    // firstCategoryId,
    // firstCategoryName,
    // secondCategoryId,
    // secondCategoryName,
    // thirdCategoryId,
    // thirdCategoryName
    // customPoiFirstCategoryId: inPoiFirstCategoryId,
    // customPoiFirstCategoryName: inPoiFirstCategoryName,
    // customPoiSecondCategoryId: inPoiSecondCategoryId,
    // customPoiSecondCategoryName: inPoiSecondCategoryName
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
    hotValueInfo: labelVo,
    isExist: Number(isExist) === 1,
    sequence: firstCategorySequence,
    customSequence: inPoiFirstCategorySequence,
    productStatus
  }
  return recommendProduct
}

export const convertNewArrivalEditProductList = (list) => (list || []).map(convertNewArrivalEditProduct)
