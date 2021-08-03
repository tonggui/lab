import {
  MerchantDetailProduct,
  MerchantProduct
} from '../../../interface/product'
import { convertLimitSale } from '../../common/convertFromServer'
import {
  convertPoorPictureList,
  convertProductAttributeList,
  convertCategoryAttrMap,
  convertProductSellTime
} from '../utils'
import {
  convertProductSkuList
} from '../withCategoryAttr/convertFromServer'
import { PRODUCT_AUDIT_STATUS, PRODUCT_SELL_STATUS } from '../../../enums/product'
import { trimSplit } from '@/common/utils'
import { get, defaultTo } from 'lodash'
import { MerchantTaskInfo } from '@/data/interface/common'

const convertSnapshotNode = snapshot => {
  const { category = {}, categoryAttrMap = {}, skus = [], ...others } = snapshot || {}
  const { valueMap } = convertCategoryAttrMap(categoryAttrMap)
  return {
    ...others,
    skuList: convertProductSkuList(skus),
    category: category ? {
      id: category.categoryId,
      idPath: trimSplit(category.idPath).map(v => +v),
      name: category.categoryName,
      namePath: trimSplit(category.categoryNamePath)
    } : undefined,
    normalAttributesValueMap: valueMap
  }
}

export const convertTags = (tags = []) => {
  return tags.map((tag: any) => {
    let leafTag = tag
    // 后续考虑isLeaf是否需要判断
    while (tag.subTags && tag.subTags.length) {
      leafTag = tag.subTags[0]
    }
    return {
      id: leafTag.id,
      name: leafTag.name
    }
  })
}
/**
 * 商品详情清洗
 * @param product
 */
export const convertProductDetail = data => {
  const attrMap = {
    ...data.categoryAttrMap,
    ...data.spuSaleAttrMap
  }
  const category = data.category || {}
  const { attrList, valueMap } = convertCategoryAttrMap(attrMap)
  const node: MerchantDetailProduct = {
    id: data.spuId,
    poiIds: data.wmPoiIds || [],
    name: data.name,
    category: {
      id: category.categoryId,
      idPath: trimSplit(category.idPath).map(v => +v),
      name: category.categoryName,
      namePath: trimSplit(category.categoryNamePath)
    },
    pictureList: trimSplit(data.pic),
    poorPictureList: convertPoorPictureList(data.poorImages),
    upcCode: get(data, 'skus[0].upc') || '', // (data.skus[0] || {}).upc,
    description: data.description || '',
    spId: data.spId,
    isSp: data.isSp === 1,
    skuList: convertProductSkuList(data.skus),
    categoryAttrValueMap: valueMap,
    categoryAttrList: attrList,
    tagList: (data.tags || []).map(({ id, name }) => ({ id, name })),
    labelList: (data.labels || []).map(i => ({
      label: i.groupName,
      value: i.groupId
    })),
    attributeList: convertProductAttributeList(data.attrList),
    shippingTime: convertProductSellTime(data.saleTime || '-'),
    pictureContentList: trimSplit(data.picContent),
    minOrderCount: data.minOrderCount,
    releaseType: data.releaseType,
    limitSale: convertLimitSale(data.limitSale),
    auditStatus: data.auditStatus || PRODUCT_AUDIT_STATUS.UNAUDIT,
    upcImage: data.upcImage,
    isMissingInfo: !!data.missingRequiredInfo,
    sellStatus: defaultTo(data.sellStatus, PRODUCT_SELL_STATUS.OFF),
    spPictureContentList: trimSplit(data.spPicContent),
    spPictureContentSwitch: data.spPicContentSwitch === 1,
    preSale: {
      saleType: data.saleType,
      deliveryTime: data.deliveryTime
    }
  }
  return node
}
/**
 * 列表页清洗
 * @param product
 */
export const convertMerchantProduct = (product: any): MerchantProduct => {
  const {
    spuId,
    name,
    priceRange,
    poiCount,
    pictures,
    ctime,
    sequence,
    sellStatus,
    merchantDelStatus,
    skuVoList,
    tagList,
    limitRuleId
  } = product
  const node: MerchantProduct = {
    id: spuId,
    name: name || '',
    priceRange: priceRange || '',
    poiCount: poiCount || 0,
    pictureList: pictures || [],
    ctime: ctime || '',
    sequence,
    sellStatus,
    isMerchantDelete: merchantDelStatus === 1,
    isMissingInfo: !!product.missingRequiredInfo,
    skuList: convertProductSkuList(skuVoList),
    tagList: tagList || [],
    limitRuleId
  }
  return node
}
/**
 * 医药商家商品中心优化列表页清洗
 * @param product
 */
export const convertMedicineMerchantProduct = (product: any): MerchantProduct => {
  const {
    spuId,
    name,
    priceRange,
    poiCount,
    pictures,
    ctime,
    sequence,
    sellStatus,
    merchantDelStatus,
    skuVoList,
    opLogId,
    opLogTime,
    categoryId,
    upc
  } = product
  // 设置基本信息要展示的字段
  const skuList = convertProductSkuList(skuVoList || [{}])
  const displayInfo: (string|string[])[] = []
  const spuExtends = product.wmProductSpuExtends || {}
  // const isOTC = +(spuExtends['1200000081'] || {}).value === 1 // 处方类型（是否OTC）
  // const isPrescription = +(spuExtends['1200000081'] || {}).value === 2 // 处方类型（是否为处方药）
  const sourceFoodCode = `${skuList[0].sourceFoodCode || ''}` // 货号
  const permissionNumber = `${(spuExtends['1200000086'] || {}).value || ''}` // 批准文号
  // 药品基本信息中展示批准文号、货号、UPC
  displayInfo.push([permissionNumber, sourceFoodCode], [upc])
  const node: MerchantProduct = {
    id: spuId,
    name: name || '',
    priceRange: priceRange || '',
    poiCount: poiCount || 0,
    pictureList: pictures || [],
    ctime: ctime || '',
    sequence,
    sellStatus,
    isMerchantDelete: merchantDelStatus === 1,
    isMissingInfo: !!product.missingRequiredInfo,
    skuList,
    opLogId,
    opLogTime,
    categoryId,
    displayInfo
  }
  return node
}
/**
 * 商品审核详情清洗
 * @param data
 */
export const convertAuditProductDetail = data => {
  const product = convertProductDetail(data.productSpu || {})
  const state = data.state || 0 // 审核流状态，1-审核中，2-审核通过，3-暂不处理, 4-撤销, 5-审核驳回
  const dataSource = data.dataSource || 2 // 数据来源 1-运营，2-商家申报，3-商家纠错，4-品牌商，5-品牌商纠错，6-商家回流
  let auditStatus = 0
  if (state === 1 || state === 2) {
    auditStatus = state
  } else if (state === 4) {
    auditStatus = PRODUCT_AUDIT_STATUS.AUDIT_REVOCATION
  } else if (state === 5) {
    auditStatus = dataSource === 3 ? PRODUCT_AUDIT_STATUS.AUDIT_CORRECTION_REJECTED : PRODUCT_AUDIT_STATUS.AUDIT_REJECTED
  }
  return {
    ...product,
    auditType: data.auditType,
    auditStatus,
    productSource: dataSource,
    currentMis: data.currentMis,
    processId: data.processId,
    taskList: data.tasks || [],
    snapshot: convertSnapshotNode(data.snapshot),
    approveSnapshot: convertSnapshotNode(data.auditorUpdateBeforeData)
  }
}

export const convertMerchantProductList = (list: any[]): MerchantProduct[] => {
  list = list || []
  return list.map(convertMerchantProduct)
}

export const convertMedicineMerchantProductList = (list: any[]): MerchantProduct[] => {
  list = list || []
  return list.map(convertMedicineMerchantProduct)
}

/**
 * 商品管理处理进度的任务列表节点清洗
 * @param node
 * @returns {TaskInfo}
 */
export const convertTask = (node: any, index: number): MerchantTaskInfo => {
  const task: MerchantTaskInfo = {
    id: node.id || index,
    name: node.name,
    opTime: node.opTime,
    status: node.status,
    downLoadUrl: node.downLoadUrl
  }
  return task
}

export const convertTaskList = (list: any[]): MerchantTaskInfo[] => {
  list = list || []
  return list.map(convertTask)
}
