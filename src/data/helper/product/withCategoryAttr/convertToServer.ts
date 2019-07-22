import { Product, Sku } from '../../../interface/product'
import {
  convertSellTime,
  convertProductLabelList,
  convertAttributeList
} from '../base/convertToServer'
import {
  convertCategoryAttr
} from '../../category/convertToServer'
import { ATTR_TYPE } from '../../../enums/category'
import {
  CategoryAttr
} from '../../../interface/category'

export const convertCategoryAttrList = (attrList: CategoryAttr[], valueMap) => {
  const categoryAttrMap = {}
  const spuSaleAttrMap = {}

  const attrMap = {}
  attrList.forEach((attr) => {
    attrMap[attr.id] = attr
  })
  Object.entries(valueMap)
  .forEach(([attrId, value]) => {
    const node = convertCategoryAttr(attrMap[attrId], value)
    if (attrMap[attrId].attrType === ATTR_TYPE.SELL) {
      spuSaleAttrMap[attrId] = node
    } else {
      categoryAttrMap[attrId] = node
    }
  })
  return {
    categoryAttrMap,
    spuSaleAttrMap
  }
}

export const convertProductSkuList = (skuList: Sku[]) => {
  skuList = skuList || []
  return skuList.map(sku => {
    const node = {
      id: sku.id,
      spec: sku.specName,
      price: Number(sku.price.value),
      unit: sku.price.unit,
      stock: Number(sku.stock),
      weight: Number(sku.weight.value),
      weightUnit: sku.weight.unit,
      boxPrice: Number(sku.box.price),
      boxNum: Number(sku.box.count),
      upcCode: sku.upcCode,
      sourceFoodCode: sku.sourceFoodCode,
      shelfNum: sku.shelfNum,
      minOrderCount: sku.minOrderCount,
      skuAttrs: ([] as object[])
    }
    if (sku.categoryAttrList) {
      node.skuAttrs = sku.categoryAttrList.map(attr => {
        const {
          parentId: attrId,
          parentName: attrName,
          id,
          name,
          sequence
        } = attr
        return ({
          sequence,
          attrId,
          attrName,
          valueId: id,
          value: name,
          valueIdPath: attr.idPath,
          valuePath: attr.namePath,
        });
      })
    }
    return node
  })
}

export const convertProductDetail = (product: Product) => {
  const {
    categoryAttrList,
    categoryAttrValueMap
  } = product

  const {
    categoryAttrMap,
    spuSaleAttrMap
  } = convertCategoryAttrList(categoryAttrList!, categoryAttrValueMap)

  const node = {
    id: product.id,
    name: product.name,
    description: product.description,
    picContent: product.pictureContentList,
    shippingTimeX: convertSellTime(product.shippingTime),
    skus: JSON.stringify(convertProductSkuList(product.skuList)),
    attrList: JSON.stringify(convertAttributeList(product.attributeList || [], product.id)),
    picture: product.pictureList.join(','),
    items: JSON.stringify(convertProductLabelList(product.labelList)),
    minOrderCount: product.minOrderCount,
    isSp: product.isSp,
    spId: product.spId,
    upcCode: product.upcCode,
    categoryId: product.category.id,
    categoryName: product.category.name,
    releaseType: product.releaseType,
    tagList: JSON.stringify(product.tagList || []),
    categoryAttrMap: JSON.stringify(categoryAttrMap),
    spuSaleAttrMap: JSON.stringify(spuSaleAttrMap),
  }
  return node
}
