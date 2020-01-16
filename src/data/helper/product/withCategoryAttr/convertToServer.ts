import { Product, Sku } from '../../../interface/product'
import {
  convertSellTime,
  convertProductLabelList,
  convertAttributeList
} from '../base/convertToServer'
import {
  convertCategoryAttr,
  convertCategoryAttrValue
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
      price: Number(sku.price.value) || 0,
      unit: sku.price.unit,
      stock: Number(sku.stock) || 0,
      weight: Number(sku.weight.value) || 0,
      weightUnit: sku.weight.unit,
      ladderPrice: Number(sku.box.price) || 0,
      ladderNum: Number(sku.box.count) || 1,
      upcCode: sku.upcCode || '',
      upc: sku.upcCode || '',
      sourceFoodCode: sku.sourceFoodCode || '',
      skuCode: sku.sourceFoodCode || '',
      shelfNum: sku.shelfNum || '',
      minOrderCount: sku.minOrderCount || 0,
      skuAttrs: ([] as object[])
    }
    if (sku.categoryAttrList) {
      node.skuAttrs = sku.categoryAttrList.map(attr => {
        const {
          parentId: attrId,
          parentName: attrName,
        } = attr
        const node = convertCategoryAttrValue(attr)
        return ({
          ...node,
          attrId,
          attrName,
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
    picContent: (product.pictureContentList || []).join(','),
    spPicContentSwitch: (product.pictureContentList && product.pictureContentList.length) ? Number(product.spPictureContentSwitch) : 1, // 如果图片详情为空，则默认打开给买家展示品牌商图片详情的开关
    shippingTimeX: convertSellTime(product.shippingTime),
    skus: JSON.stringify(convertProductSkuList(product.skuList.filter(sku => sku.editable))),
    attrList: JSON.stringify(convertAttributeList(product.attributeList || [], product.id)),
    picture: product.pictureList.join(','),
    labels: JSON.stringify(convertProductLabelList(product.labelList)),
    isSp: product.spId ? (product.isSp ? 1 : 2) : 0, // 关联标品为1，关联非标为2，未关联为0
    spId: product.spId === undefined ? null : product.spId,
    categoryId: product.category.id,
    releaseType: product.releaseType,
    tagList: JSON.stringify((product.tagList || []).map(item => ({ tagId: item.id, tagName: item.name }))),
    categoryAttrMap: JSON.stringify(categoryAttrMap),
    spuSaleAttrMap: JSON.stringify(spuSaleAttrMap),
  }
  return node
}
