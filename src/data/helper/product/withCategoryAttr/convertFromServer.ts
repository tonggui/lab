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
import { trimSplit } from '@/common/utils'

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
      idPath: trimSplit(data.categoryIdPath).map(v => +v),
      name: data.categoryName,
      namePath: trimSplit(data.categoryNamePath)
    },
    pictureList: trimSplit(data.picture),
    poorPictureList: convertPoorPictureList(data.poorImages),
    upcCode: (data.skus[0] || {}).upcCode,
    description: data.description || '',
    spId: data.spId,
    isSp: data.isSp,
    skuList: convertProductSkuList(data.skus),
    categoryAttrValueMap: valueMap,
    categoryAttrList: attrList,
    tagList: data.tagList.map(({ tagId, tagName }) => ({ id: tagId, name: tagName })),
    labelList: (data.items || []).map(i => (i.group_id || i.groupId)),
    attributeList: convertProductAttributeList(data.attrList),
    shippingTime: convertProductSellTime(data.shippingTimeX),
    pictureContentList: trimSplit(data.picContent),
    minOrderCount: data.minOrderCount,
    sourceFoodCode: data.sourceFoodCode,
    releaseType: data.releaseType,
  }
  return node;
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
    upcCode: sku.upcCode,
    sourceFoodCode: sku.sourceFoodCode,
    shelfNum: sku.shelfNum,
    minOrderCount: sku.minOrderCount || 1,
    categoryAttrList: convertCategoryAttrValueList(sku.skuAttrs || [])
  }
  return node
}

export const convertProductSkuList = (list: any[]): Sku[] => {
  list = list || []
  return list.map(convertProductSku)
}