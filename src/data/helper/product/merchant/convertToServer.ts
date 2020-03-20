import {
  MerchantDetailProduct, ProductAttribute
} from '../../../interface/product'
import { convertLimitSale } from '../../common/convertToServer'
import {
  convertSellTime
} from '../base/convertToServer'
import {
  convertCategoryAttrList,
  convertProductSkuList
} from '../withCategoryAttr/convertToServer'

export const convertProductToServer = (product: MerchantDetailProduct): any => {
  const {
    categoryAttrList = [],
    categoryAttrValueMap
  } = product

  const {
    categoryAttrMap,
    spuSaleAttrMap
  } = convertCategoryAttrList(categoryAttrList, categoryAttrValueMap)

  const params: any = {
    spuId: product.id,
    wmPoiIds: product.poiIds || [],
    name: product.name,
    isSp: product.spId ? (product.isSp ? 1 : 2) : 0, // 关联标品为1，关联非标为2，未关联为0
    spId: product.spId === undefined ? null : product.spId,
    categoryId: product.category.id,
    tagIds: product.tagList.map(tag => tag.id),
    unit: product.skuList[0] ? (product.skuList[0].price.unit || '份') : '份',
    pic: product.pictureList.join(','),
    labels: convertProductLabelList(product.labelList),
    attrList: convertAttributeList(product.attributeList || [], product.id),
    saleTime: convertSellTime(product.shippingTime),
    minOrderCount: product.minOrderCount,
    description: product.description,
    picContent: product.pictureContentList ? product.pictureContentList.join(',') : '',
    skus: convertProductSkuList(product.skuList.filter(sku => sku.editable)),
    limitSale: convertLimitSale(product.limitSale, true),
    categoryAttrMap,
    spuSaleAttrMap
  }
  return params
}

export const convertProductLabelList = (list) => {
  list = list || []
  return list.map(item => ({
    groupId: item.value,
    subAttr: 0
  }))
}

export const convertAttributeList = (attributeList: ProductAttribute[], spuId) => {
  if (attributeList && attributeList.length > 0) {
    let idx = 0
    return attributeList.filter(item => !!item.name.trim() && item.value && item.value.length).reduce((list: any[], { name = '', value = [] }) => {
      const targetList = value.filter(v => !!(v && v.trim())).map(val => ({
        id: '',
        spuId,
        no: idx,
        name,
        value: val
      }))
      idx += 1
      return list.concat(targetList)
    }, [])
  }
  return []
}
