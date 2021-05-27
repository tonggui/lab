import { Product, Sku } from '../../../interface/product'
import { convertLimitSale } from '../../common/convertFromServer'
import {
  convertProductBrandVideoFromServer,
  convertProductLabel,
  convertProductVideoFromServer
} from '../base/convertFromServer'
import {
  convertCategoryAttrMap,
  convertPoorPictureList,
  convertProductAttributeList,
  convertProductSellTime
} from '../utils'
import { convertCategoryAttrValueList } from '../../category/convertFromServer'
import { PRODUCT_AUDIT_STATUS, PRODUCT_BRAND_VIDEO_STATUS, PRODUCT_SELL_STATUS } from '../../../enums/product'
import { trimSplit } from '@/common/utils'
import { defaultTo, get, isEmpty } from 'lodash'

export const convertProductDetail = data => {
  const attrMap = {
    ...data.categoryAttrMap,
    ...data.spuSaleAttrMap
  }
  const { attrList, valueMap } = convertCategoryAttrMap(attrMap)
  const category = data.category || {}
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
    spVideo: convertProductBrandVideoFromServer(data.spVideoVo, data.spVideoStatus),
    spVideoStatus: get(data, 'spVideoStatus', PRODUCT_BRAND_VIDEO_STATUS.UNCONFIRMED),
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
    limitSale: convertLimitSale(data.limitSale),
    auditStatus: data.auditStatus || PRODUCT_AUDIT_STATUS.UNAUDIT,
    upcImage: data.upcImage || '',
    sellStatus: defaultTo(data.sellStatus, PRODUCT_SELL_STATUS.OFF),
    isMissingInfo: !!data.missingRequiredInfo,
    marketingPicture: trimSplit(data.marketingPicture),
    shippingTemplateId: data.shippingTemplateId,
    shippingTemplateName: data.shippingTemplateName,
    isMedicare: data.isMedicare ? '是' : '否',
    detailSymbol: data.detailSymbol || 0,
    recoverySymbol: data.recoverySymbol || 0,
    preSale: {
      saleType: data.saleType,
      deliveryTime: data.deliveryTime
    }
  }

  // 获取详情时，如果品牌商视频启用中，但无品牌商视频，需要修正为未使用状态
  if (
    node.spVideoStatus === PRODUCT_BRAND_VIDEO_STATUS.ENABLED &&
    isEmpty(get(node.spVideo, 'src'))
  ) {
    node.spVideoStatus = PRODUCT_BRAND_VIDEO_STATUS.UNCONFIRMED
  }

  return node
}

export const convertProductWeight = (weight: any) => {
  return weight === -1 ? '' : weight
}

export const convertSkuCommonProperty = (property: any) => {
  if (!property) return null
  const { allowUpcEmpty = 'false' } = property
  const newProperty = {
    allowUpcEmpty: allowUpcEmpty === 'true'
  }
  return newProperty
}

export const convertProductCategory = (category: any) => {
  return {
    id: category.categoryId,
    name: category.categoryName,
    idPath: trimSplit(category.categoryIdPath || ''),
    namePath: trimSplit(category.categoryNamePath || '')
  }
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
      value: convertProductWeight(sku.weight),
      unit: sku.weightUnit || '克(g)',
      ignoreMax: false
    },
    stock: sku.stock,
    box: {
      price: sku.ladderPrice || 0,
      count: sku.ladderNum || 1
    },
    // TODO
    // 单门店 接口返回 upcCode
    // 商家商品库中心返回 upc
    // 后端表示 upc 是 规范写法 此处 冗余读取 so sad :)
    upcCode: isSp ? (sku.upc || sku.upcCode) : '', // 非标清除sku上的upcCode
    commonProperty: convertSkuCommonProperty(sku.commonProperty),
    // TODO 同上
    // 单门店 接口返回 sourceFoodCode
    // 商家商品库中心返回 skuCode
    // 后端表示 skuCode 是 规范写法 此处 冗余读取 so sad :)
    sourceFoodCode: sku.skuCode || sku.sourceFoodCode,
    shelfNum: sku.shelfNum,
    minOrderCount: sku.minOrderCount || 1,
    categoryAttrList: convertCategoryAttrValueList(skuAttrs),
    suggestedPrice: defaultTo(sku.oriPrice, ''),
    monthSale: sku.monthSale,
    // 库存是否可以编辑
    enableStockEditing: sku.enableStockEditing,
    // sku是否参与组包
    relCombinationProduct: sku.relCombinationProduct
  }
  return node
}

export const convertProductSkuList = (list: any[], isSp: boolean = true): Sku[] => {
  list = list || []
  return list.map(v => convertProductSku(v, isSp))
}
