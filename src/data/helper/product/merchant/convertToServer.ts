import {
  MerchantDetailProduct, ProductAttribute
} from '../../../interface/product'
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
    wmPoiIds: product.poiIds,
    isSp: Number(product.isSp),
    spId: product.spId,
    categoryId: product.category.id,
    tagIds: product.tagList.map(tag => tag.id),
    brand: null,
    origin: null,
    picture: product.pictureList.join(','),
    labels: convertProductLabelList(product.labelList),
    attrList: convertAttributeList(product.attributeList || [], product.id),
    saleTime: convertSellTime(product.shippingTime),
    minOrderCount: product.minOrderCount,
    description: product.description,
    picContent: product.pictureContentList,
    skus: convertProductSkuList(product.skuList),
    categoryAttrMap,
    spuSaleAttrMap
  }
  if (product.brand) {
    params.brand = {
      brandId: product.brand.id || -1,
      brandName: product.brand.name,
      spBrandId: product.brand.spBrandId || -1,
      brandSourceType: product.brand.type || 0
    }
  }
  if (product.origin) {
    params.origin = {
      originId: product.origin.id,
      originName: product.origin.name
    }
  }
  return params
}

export const convertProductLabelList = (list) => {
  list = list || []
  list.map(id => ({
    groupId: id,
    subAttr: 0
  }))
  return list
}

export const convertAttributeList = (attributeList: ProductAttribute[], spuId) => {
  if (attributeList && attributeList.length > 0) {
    let idx = 0
    return attributeList.reduce((list: any[], { name, value }) => {
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
