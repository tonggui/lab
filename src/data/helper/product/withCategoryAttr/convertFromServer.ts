import {
  Product,
  Sku,
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

export const convertProductDetail = data => {
  const attrMap = {
    ...data.categoryAttrMap,
    ...data.spuSaleAttrMap,
  }
  const { attrList, valueMap } = convertCategoryAttrMap(attrMap);
  const node: Product = {
    id: data.id,
    name: data.name,
    category: {
      id: data.categoryId,
      idPath: (data.categoryIdPath || '').split(','),
      name: data.categoryName,
      namePath: (data.categoryNamePath || '').split(',')
    },
    pictureList: (data.picture || '').split(','),
    poorPictureList: convertPoorPictureList(data.poorImages),
    upcCode: (data.skus[0] || {}).upcCode,
    description: data.description || '',
    spId: data.spId,
    isSp: data.isSp,
    skuList: convertProductSkuList(data.skus),
    categoryAttrValueMap: valueMap,
    categoryAttrList: attrList,
    tagList: data.tagList.map(({ tagId, tagName }) => ({ id: tagId, name: tagName })),
    labelList: (data.labels || []).map(i => (i.group_id || i.groupId)),
    attributeList: convertProductAttributeList(data.attrList),
    shippingTime: convertProductSellTime(data.shippingTimeX),
    pictureContentList: (data.picContent || '').splice(','),
    minOrderCount: data.minOrderCount,
    sourceFoodCode: data.sourceFoodCode,
    releaseType: data.releaseType,
  }
  return node;
}

export const convertProductSku = (sku: any): Sku => {
  const node: Sku = {
    id: sku.id,
    specName: sku.spec,
    unit: sku.unit,
    price: sku.price,
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