import { defaultTo, get } from 'lodash'
import { isEmpty } from '@/common/utils'
import {Product, Sku, CellularProductSku, ProductVideo} from '../../../interface/product'
import {
  convertAttributeList,
  convertProductLabelList,
  convertProductVideoToServer,
  convertSellTime
} from '../base/convertToServer'
import { convertLimitSaleValue } from '../../common/convertToServer'
import { convertCategoryAttr, convertCategoryAttrValue } from '../../category/convertToServer'
import { ATTR_TYPE } from '../../../enums/category'
import { CategoryAttr } from '../../../interface/category'
import { PRODUCT_AUDIT_STATUS, PRODUCT_BRAND_VIDEO_STATUS } from '@/data/enums/product'
import { EDIT_TYPE } from '../../../enums/common'

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

export const convertCommonPropertyToSever = (commonProperty: object) => {
  if (!commonProperty) return null
  const allowUpcEmpty = get(commonProperty, 'allowUpcEmpty')
  return {
    allowUpcEmpty: `${allowUpcEmpty}`
  }
}

export const convertProductSkuList = (skuList: (Sku | CellularProductSku)[], spuSaleAttrMap?) => {
  skuList = skuList || []
  return skuList.map(sku => {
    const node = {
      id: sku.id,
      spec: sku.specName,
      price: Number(sku.price.value) || 0,
      unit: sku.price.unit,
      stock: isEmpty(sku.stock) ? 0 : sku.stock,
      weight: isEmpty(sku.weight.value) ? -1 : sku.weight.value,
      weightUnit: sku.weight.unit,
      ladderPrice: Number(sku.box.price) || 0,
      ladderNum: Number(sku.box.count) || 1,
      upcCode: sku.upcCode === get(sku, 'commonProperty.allowUpcEmpty', false) ? '' : sku.upcCode || '',
      upc: sku.upcCode === get(sku, 'commonProperty.allowUpcEmpty', false) ? '' : sku.upcCode || '',
      sourceFoodCode: sku.sourceFoodCode || '',
      skuCode: sku.sourceFoodCode || '',
      shelfNum: sku.shelfNum || '',
      minOrderCount: sku.minOrderCount || 0,
      skuAttrs: ([] as object[]),
      oriPrice: +defaultTo(sku.suggestedPrice, 0),
      commonProperty: convertCommonPropertyToSever((sku.commonProperty || null) as object)
    }

    if ((spuSaleAttrMap === undefined || (spuSaleAttrMap && Object.keys(spuSaleAttrMap).length)) && sku.categoryAttrList) {
      node.skuAttrs = sku.categoryAttrList.map(attr => {
        const {
          parentId: attrId,
          parentName: attrName
        } = attr
        const node = convertCategoryAttrValue(attr)
        return ({
          ...node,
          attrId,
          attrName
        })
      })
    }
    return node
  })
}

export const convertProductDetail = (product: Product, { showLimitSale = true }) => {
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
    shippingTimeX: convertSellTime(product.shippingTime, product),
    skus: JSON.stringify(convertProductSkuList(product.skuList.filter(sku => sku.editable), spuSaleAttrMap)),
    attrList: JSON.stringify(convertAttributeList(product.attributeList || [], product.id)),
    picture: product.pictureList.join(','),
    labels: JSON.stringify(convertProductLabelList(product.labelList)),
    isSp: product.spId ? (product.isSp ? 1 : 2) : 0, // 关联标品为1，关联非标为2，未关联为0
    spId: product.spId === undefined ? null : product.spId,
    categoryId: product.category.id,
    releaseType: product.releaseType,
    tagList: JSON.stringify((product.tagList || []).map(item => ({ tagId: item.id, tagName: item.name }))),
    limitSale: showLimitSale ? convertLimitSaleValue(product.limitSale) : undefined,
    categoryAttrMap: JSON.stringify(categoryAttrMap),
    spuSaleAttrMap: JSON.stringify(spuSaleAttrMap),
    upcImage: product.upcImage || '',
    sellStatus: product.sellStatus,
    marketingPicture: (product.marketingPicture || []).join(','),
    shippingTemplateId: product.shippingTemplateId,
    video: JSON.stringify(convertProductVideoToServer(product.video as ProductVideo)),
    saleType: product.preSale && product.preSale.saleType,
    deliveryTime: product.preSale && product.preSale.deliveryTime

  }
  return node
}

/**
 * 将表单数据转换为提交的数据格式
 * @param poiId 门店ID
 * @param product 商品信息
 * @param context 上下文信息
 */
export const convertProductFormToServer = ({ poiId, product, context }: { poiId: number, product: Product, context }) => {
  const newProduct = convertProductDetail(product, context)
  const params: any = {
    ...newProduct,
    wmPoiId: poiId
  }
  const { entranceType, dataSource, validType = 0, ignoreSuggestCategory, suggestCategoryId, needAudit, isNeedCorrectionAudit, editType, checkActivitySkuModify = false, isAuditFreeProduct, usedSuggestCategory = false } = context
  params.skipAudit = isAuditFreeProduct
  params.validType = validType
  params.ignoreSuggestCategory = ignoreSuggestCategory
  params.suggestCategoryId = suggestCategoryId
  params.missingRequiredInfo = product.isMissingInfo || false
  params.auditStatus = product.auditStatus || PRODUCT_AUDIT_STATUS.UNAUDIT
  params.useSuggestCategory = usedSuggestCategory
  // TODO 去掉EDIT_TYPE判断
  // 审核中修改 || 先发后审 审核中修改 都属于3
  // 保存状态：1-正常保存; 2-提交审核; 3-重新提交审核(目前仅在审核中和先发后审 审核中)
  if (editType === EDIT_TYPE.AUDITING_MODIFY_AUDIT || product.auditStatus === PRODUCT_AUDIT_STATUS.START_SELL_AUDITING) {
    params.saveType = 3
  } else {
    params.saveType = needAudit ? 2 : 1
  }
  // params.saveType = editType === EDIT_TYPE.AUDITING_MODIFY_AUDIT ? 3: needAudit ? 2 : 1 // 保存状态：1-正常保存; 2-提交审核; 3-重新提交审核(目前仅在审核中)
  params.auditSource = isNeedCorrectionAudit ? 2 : 1 // 数据来源：1-商家提报; 2-商家纠错
  if (entranceType && dataSource) {
    params.entranceType = entranceType
    params.dataSource = dataSource
  }
  if (product.video && product.video.id) {
    params.wmProductVideo = JSON.stringify(convertProductVideoToServer(product.video))
  }
  params.spVideoStatus = get(product, 'spVideoStatus', PRODUCT_BRAND_VIDEO_STATUS.UNCONFIRMED)
  params.checkActivitySkuModify = checkActivitySkuModify
  return params
}
