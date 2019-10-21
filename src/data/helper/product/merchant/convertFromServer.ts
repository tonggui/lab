import {
  MerchantDetailProduct,
  MerchantProduct,
  Sku
} from '../../../interface/product'
import {
  convertPoorPictureList,
  convertProductAttributeList,
  convertCategoryAttrMap,
  convertProductSellTime
} from '../utils'
import {
  convertCategoryAttrValueList
} from '../../category/convertFromServer'
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
  const origin = data.origin || {}
  const brand = data.brand || {}
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
    origin: {
      id: origin.originId || 0,
      name: origin.originName || ''
    },
    brand: {
      id: brand.brandId || 0,
      spBrandId: brand.spBrandId, // 标品库品牌ID
      name: brand.brandName,
      type: brand.brandSourceType
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
    releaseType: data.releaseType
  }
  return node
}

export const convertProductSku = (sku: any): Sku => {
  const node: Sku = {
    id: sku.id,
    __id__: sku.id,
    specName: sku.spec,
    editable: true,
    price: {
      value: sku.price,
      unit: sku.unit || '份'
    },
    weight: {
      value: sku.weight,
      unit: sku.weightUnit || '克(g)'
    },
    stock: sku.stock,
    box: {
      price: sku.boxPrice,
      count: sku.boxNum
    },
    upcCode: sku.upc,
    sourceFoodCode: sku.skuCode,
    shelfNum: sku.shelfNum,
    minOrderCount: sku.minOrderCount,
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
    name: name || '',
    priceRange: priceRange || '',
    poiCount: poiCount || 0,
    pictureList: pictures || [],
    ctime: ctime || '',
    sequence,
    sellStatus
  }
  return node
}

export const convertMerchantProductList = (list: any[]): MerchantProduct[] => {
  list = list || []
  return list.map(convertMerchantProduct)
}
