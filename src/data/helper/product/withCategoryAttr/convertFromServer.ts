import {
  Product,
  Sku,
} from '../../../interface/product'
import { convertProductVideoFromServer, convertProductLabel } from '../base/convertFromServer'
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
  const category = data.category || {};
  const node: Product = {
    id: data.id,
    name: data.name,
    category: {
      id: category.categoryId,
      idPath: trimSplit(category.idPath).map(v => +v),
      name: category.categoryName,
      namePath: trimSplit(category.categoryNamePath)
    },
    pictureList: trimSplit(data.picture),
    video: convertProductVideoFromServer(data.wmProductVideo),
    poorPictureList: convertPoorPictureList(data.poorImages),
    upcCode: (data.skus[0] || {}).upcCode,
    description: data.description || '',
    spId: data.spId,
    isSp: data.isSp === 1,
    skuList: convertProductSkuList(data.skus),
    categoryAttrValueMap: valueMap,
    categoryAttrList: attrList,
    tagList: (data.tagList || []).map(({ tagId, tagName }) => ({ id: tagId, name: tagName })),
    labelList: (data.labels || []).map(convertProductLabel),
    attributeList: convertProductAttributeList(data.attrList),
    shippingTime: convertProductSellTime(data.shippingTimeX),
    pictureContentList: trimSplit(data.picContent),
    spPictureContentList: trimSplit(data.spPicContent),
    spPictureContentSwitch: data.spPicContentSwitch === 1,
    minOrderCount: data.minOrderCount,
    sourceFoodCode: data.sourceFoodCode,
    releaseType: data.releaseType,
  }
  return node;
}

export const convertProductSku = (sku: any, isSp: boolean = true): Sku => {
  const skuAttrs = (sku.skuAttrs || []).map(i => ({
    ...i,
    selected: 1
  }))
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
    upcCode: isSp ? sku.upcCode : '', // 非标清除sku上的upcCode
    sourceFoodCode: sku.sourceFoodCode,
    shelfNum: sku.shelfNum,
    minOrderCount: sku.minOrderCount || 1,
    categoryAttrList: convertCategoryAttrValueList(skuAttrs)
  }
  return node
}

export const convertProductSkuList = (list: any[], isSp: boolean = true): Sku[] => {
  list = list || []
  return list.map(v => convertProductSku(v, isSp))
}
