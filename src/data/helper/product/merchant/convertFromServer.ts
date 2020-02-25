import {
  MerchantDetailProduct,
  MerchantProduct
} from '../../../interface/product'
import { convertLimitSale } from '../../common/convertFromServer'
import {
  convertPoorPictureList,
  convertProductAttributeList,
  convertCategoryAttrMap,
  convertProductSellTime
} from '../utils'
import {
  convertProductSkuList
} from '../withCategoryAttr/convertFromServer'
import { trimSplit } from '@/common/utils'

export const convertTags = (tags = []) => {
  return tags.map((tag: any) => {
    let leafTag = tag
    // 后续考虑isLeaf是否需要判断
    while (tag.subTags && tag.subTags.length) {
      leafTag = tag.subTags[0]
    }
    return {
      id: leafTag.id,
      name: leafTag.name
    }
  })
}

export const convertProductDetail = data => {
  const attrMap = {
    ...data.categoryAttrMap,
    ...data.spuSaleAttrMap
  }
  const category = data.category || {}
  const { attrList, valueMap } = convertCategoryAttrMap(attrMap)
  const node: MerchantDetailProduct = {
    id: data.spuId,
    poiIds: data.wmPoiIds || [],
    name: data.name,
    category: {
      id: category.categoryId,
      idPath: trimSplit(category.idPath).map(v => +v),
      name: category.categoryName,
      namePath: trimSplit(category.categoryNamePath)
    },
    pictureList: trimSplit(data.pic),
    poorPictureList: convertPoorPictureList(data.poorImages),
    upcCode: (data.skus[0] || {}).upc,
    description: data.description || '',
    spId: data.spId,
    isSp: data.isSp === 1,
    skuList: convertProductSkuList(data.skus),
    categoryAttrValueMap: valueMap,
    categoryAttrList: attrList,
    tagList: (data.tags || []).map(({ id, name }) => ({ id, name })),
    labelList: (data.labels || []).map(i => ({
      label: i.groupName,
      value: i.groupId
    })),
    attributeList: convertProductAttributeList(data.attrList),
    shippingTime: convertProductSellTime(data.saleTime || '-'),
    pictureContentList: trimSplit(data.picContent),
    minOrderCount: data.minOrderCount,
    releaseType: data.releaseType,
    limitSale: convertLimitSale(data.limitSale),
  }
  return node
}

export const convertMerchantProduct = (product: any): MerchantProduct => {
  const {
    spuId,
    name,
    priceRange,
    poiCount,
    pictures,
    ctime,
    sequence,
    sellStatus,
    merchantDelStatus,
    skuVoList
  } = product
  const node: MerchantProduct = {
    id: spuId,
    name: name || '',
    priceRange: priceRange || '',
    poiCount: poiCount || 0,
    pictureList: pictures || [],
    ctime: ctime || '',
    sequence,
    sellStatus,
    isMerchantDelete: merchantDelStatus === 1,
    skuList: convertProductSkuList(skuVoList)
  }
  return node
}

export const convertMerchantProductList = (list: any[]): MerchantProduct[] => {
  list = list || []
  return list.map(convertMerchantProduct)
}
