import {
  MerchantDetailProduct, ProductAttribute
} from '../../../interface/product'
import { convertLimitSaleValue } from '../../common/convertToServer'
import {
  convertSellTime
} from '../base/convertToServer'
import {
  convertCategoryAttrList,
  convertProductSkuList
} from '../withCategoryAttr/convertToServer'
import { get } from 'lodash'

export const convertProductToServer = (product: MerchantDetailProduct, context = {} as any): any => {
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
    saleTime: convertSellTime(product.shippingTime, product),
    minOrderCount: product.minOrderCount,
    description: product.description,
    picContent: product.pictureContentList ? product.pictureContentList.join(',') : '',
    skus: convertProductSkuList(product.skuList.filter(sku => sku.editable), spuSaleAttrMap),
    limitSale: context.showLimitSale ? convertLimitSaleValue(product.limitSale, true) : undefined,
    upcImage: product.upcImage,
    categoryAttrMap,
    spuSaleAttrMap,
    sellStatus: product.sellStatus,
    spPicContentSwitch: !!product.spPictureContentSwitch ? 1 : 2,
    picContentSyncPoi: !product.picContentSyncPoi
  }
  return params
}

/**
 * 商家商品中心运营端数据格式转化
 * @param product
 * @param context
 */
export const convertProductFormToServer = ({ product, context }: { product: MerchantDetailProduct, context: any }) => {
  const params = convertProductToServer(product)

  const { entranceType, dataSource, ignoreSuggestCategory, suggestCategoryId, isNeedCorrectionAudit, needAudit, saveType = undefined } = context
  params.ignoreSuggestCategory = ignoreSuggestCategory
  params.suggestCategoryId = suggestCategoryId
  params.saveType = saveType || (needAudit ? 2 : 1) // 保存状态：1-正常保存; 2-提交审核; 3-重新提交审核(目前仅在审核中)
  params.auditSource = isNeedCorrectionAudit ? 2 : 1 // 数据来源：1-商家提报; 2-商家纠错
  if (entranceType && dataSource) {
    params.entranceType = entranceType
    params.dataSource = dataSource
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
    return attributeList.filter(item => !!get(item, 'name', '').trim() && item.value && item.value.length).reduce((list: any[], { name = '', value = [] }) => {
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
