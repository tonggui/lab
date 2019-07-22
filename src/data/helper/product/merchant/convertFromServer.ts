import {
  MerchantDetailProduct,
  MerchantProduct,
  Sku
} from '../../../interface/product'
import {
  convertPoorPictureList,
  convertProductAttributeList,
  convertProductSellTime,
  convertCategoryAttrMap
} from '../utils'
import {
  convertCategoryAttrValueList
} from '../../category/convertFromServer'

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
  const { attrList, valueMap } = convertCategoryAttrMap(attrMap)
  const node: MerchantDetailProduct = {
    id: data.spuId,
    poiIds: data.wmPoiIds || [],
    name: data.name,
    category: {
      id: data.categoryId,
      idPath: (data.categoryIdPath || '').split(','),
      name: data.categoryName,
      namePath: (data.categoryNamePath || '').split(',')
    },
    pictureList: (data.pic || '').split(','),
    poorPictureList: convertPoorPictureList(data.poorImages),
    upcCode: (data.skus[0] || {}).upcCode,
    description: data.description || '',
    spId: data.spId,
    isSp: data.isSp === 1,
    skuList: convertProductSkuList(data.skus),
    categoryAttrValueMap: valueMap,
    categoryAttrList: attrList,
    tagList: data.tagList.map(({ tagId, tagName }) => ({ id: tagId, name: tagName })),
    labelList: (data.labels || []).map(i => ({
      label: i.groupName,
      value: i.groupId
    })),
    attributeList: convertProductAttributeList(data.attrList),
    shippingTime: convertProductSellTime(data.saleTime),
    pictureContentList: (data.picContent || '').splice(','),
    minOrderCount: data.minOrderCount,
    releaseType: data.releaseType
  }
  return node
}

export const convertProductSku = (sku: any): Sku => {
  const node: Sku = {
    id: sku.id,
    specName: sku.spec,
    editable: true,
    price: {
      value: sku.price,
      unit: sku.unit || '份'
    },
    weight: {
      value: sku.weight,
      unit: sku.weightUnit
    },
    stock: sku.stock,
    box: {
      price: sku.boxPrice,
      count: sku.boxNum
    },
    upcCode: sku.upcCode,
    sourceFoodCode: sku.sourceFoodCode,
    shelfNum: sku.shelfNum,
    categoryAttrList: convertCategoryAttrValueList(sku.skuAttrs || [])
  }
  return node
}

export const convertProductSkuList = (list: any[]): Sku[] => {
  list = list || []
  return list.map(convertProductSku)
}

export const convertMerchantProduct = (product: any): MerchantProduct => {
  const { spuId, name, priceRange, poiCount, pictures, ctime, sequence, sellStatus } = product
  const node: MerchantProduct = {
    id: spuId,
    name,
    priceRange,
    poiCount,
    pictureList: pictures,
    picture: (pictures || [])[0],
    ctime,
    sequence,
    sellStatus
  }
  return node
}

export const convertMerchantProductList = (list: any[]): MerchantProduct[] => {
  list = list || []
  return list.map(convertMerchantProduct)
}
