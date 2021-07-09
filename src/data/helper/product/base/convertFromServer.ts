import { get } from 'lodash'
import { BrandProductVideo, ProductInfo, ProductVideo, Sku } from '../../../interface/product'
import {
  PRODUCT_SELL_STATUS,
  PRODUCT_TYPE,
  COMPLIANCE_AUDIT_STATUS_TYPE
} from '@/data/enums/product'
import { isMedicine } from '@/common/app'
import { BaseCategory } from '@/data/interface/category'
import { trimSplit, trimSplitId } from '@/common/utils'
import { convertProductWeight } from '../withCategoryAttr/convertFromServer'

/*
 * 转换视频数据格式-转入
 */
export const convertProductVideoFromServer = (video: any): ProductVideo => {
  // eslint-disable-next-line camelcase
  const { url_mp4 = '', main_pic_small_url = '', title = '', length = 0, size = 0, ...rest } = video || {}
  const node: ProductVideo = {
    src: get(video, 'url_mp4', get(video, 'urlMp4', '')),
    poster: get(video, 'main_pic_small_url', get(video, 'mainPicSmallUrl', '')),
    size,
    title,
    duration: length,
    ...rest
  }
  return node
}

export const convertProductBrandVideoFromServer = (video: any, status?: any): BrandProductVideo => {
  return Object.assign(convertProductVideoFromServer(video), {
    status: (+status || 0)
  })
}

export const convertProductLabel = label => ({
  value: label.groupId || label.group_id,
  label: label.groupName || label.group_name
})

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
      value: convertProductWeight(sku.weight),
      unit: sku.weight_unit || '克(g)',
      ignoreMax: false
    },
    stock: sku.stock,
    box: {
      price: sku.box_price,
      count: sku.box_num
    },
    upcCode: sku.upc_code || sku.upcCode,
    sourceFoodCode: sku.source_food_code || sku.sourceFoodCode,
    shelfNum: sku.locator_code
  }
  return node
}

export const convertProductSkuList = (list: any[]): Sku[] => {
  list = list || []
  return list.map(convertProductSku)
}

export const convertProductInfo = (product: any, validationConfigMap): ProductInfo => {
  const {
    enableStockEditing,
    id,
    name,
    pictures,
    upcCode,
    description,
    sellCount,
    tagCount,
    sellStatus,
    wmProductSkus,
    likeCount,
    fillOrCheck,
    smartSort,
    wmProductVideo,
    labels,
    platformLimitSaleRule,
    categoryId,
    categoryName,
    categoryIdPath,
    categoryNamePath,
    isSp,
    spId,
    noStockAutoClear,
    tagList,
    auditStatus,
    sgLabels,
    isMedicare,
    limitRuleId,
    complianceStatus
  } = product
  let locked = false
  const category: BaseCategory = {
    id: categoryId,
    idPath: trimSplitId(categoryIdPath),
    name: categoryName,
    namePath: trimSplit(categoryNamePath)
  }
  const skuList = convertProductSkuList(wmProductSkus || [])
  // 是否下架
  const notBeSold = product.isStopSell === 1 || sellStatus === 1
  // 设置基本信息要展示的字段
  const displayInfo: (string|string[])[] = []
  const spuExtends = product.wmProductSpuExtends || {}
  const isOTC = +(spuExtends['1200000081'] || {}).value === 1 // 处方类型（是否OTC）
  const isPrescription = +(spuExtends['1200000081'] || {}).value === 2 // 处方类型（是否为处方药）
  if (isMedicine()) {
    const sourceFoodCode = `${skuList[0].sourceFoodCode || ''}` // 货号
    const permissionNumber = `${(spuExtends['1200000086'] || {}).value || ''}` // 批准文号
    // 药品基本信息中展示批准文号、货号、UPC
    displayInfo.push([permissionNumber, sourceFoodCode], [upcCode])
    // TODO 药店暂时不处理 locked
  } else {
    // 商超基本信息中展示月售和赞
    displayInfo.push([`月售 ${sellCount}`, `赞 ${likeCount}`])
    // 字段锁定只针对标品
    if (spId && isSp === 1) {
      locked = validationConfigMap[categoryId] && validationConfigMap[categoryId].propertyEditLock
    }
  }
  let errorTip = ''
  // 资质
  const qualification = {
    exist: true,
    tip: '',
    message: ''
  }

  const platformLimitSaleRuleList = (platformLimitSaleRule || []).map((rule) => {
    const { name = '', type = 1, startTime = '', endTime = '', frequency = 1, count = 0, multiPoi = false } = rule
    return {
      name,
      type,
      startTime,
      endTime,
      frequency,
      count,
      multiPoi
    }
  });
  // https://km.sankuai.com/page/346174652
  (sgLabels || []).forEach((label) => {
    const { id, name } = label
    if (id === 10000001) {
      errorTip = name
    }
  });

  (labels || []).forEach((label) => {
    const { id, groupName } = label
    if (id === 16) {
      errorTip = '超出经营范围，禁止售卖'
    } else if (id === 15) {
      qualification.exist = false
      qualification.tip = '需补充资质后方可售卖'
      qualification.message = groupName || '需补充资质后方可售卖'
    }
  })
  const productType = product.combinationLabel === 1 ? PRODUCT_TYPE.PACKAGE : PRODUCT_TYPE.NORMAL
  // 合规审核中
  const isComplianceUnderAudit = complianceStatus === COMPLIANCE_AUDIT_STATUS_TYPE.UNDER_AUDIT
  const node: ProductInfo = {
    enableStockEditing,
    id,
    name,
    type: productType,
    pictureList: pictures,
    upcCode,
    isPlatformStopSell: product.isPlatformStopSell === 1,
    isStopSell: product.isStopSell === 1,
    description,
    // 组包商品列表页只保留一个sku信息，用来显示
    skuList: productType === PRODUCT_TYPE.PACKAGE ? skuList.slice(0, 1) : skuList,
    sellStatus: notBeSold ? PRODUCT_SELL_STATUS.OFF : PRODUCT_SELL_STATUS.ON,
    tagCount,
    isNeedCheck: fillOrCheck === 2,
    isNeedFill: fillOrCheck === 1,
    isMissingInfo: !!product.missingRequiredInfo,
    isSmartSort: !!smartSort,
    displayInfo,
    isOTC: isMedicine() ? isOTC : false,
    isPrescription: isMedicine() ? isPrescription : false,
    video: convertProductVideoFromServer(wmProductVideo),
    errorTip,
    qualification,
    platformLimitSaleRuleList,
    locked,
    stockoutAutoClearStock: !!noStockAutoClear,
    tagList: tagList || [],
    auditStatus,
    category,
    isMedicare,
    isComplianceUnderAudit,
    limitRuleId
  }
  return node
}

export const convertProductInfoList = (list: any[], validationConfigMap?: { [propName:string]: any }): ProductInfo[] => {
  list = list || []
  return list.map((item) => convertProductInfo(item, validationConfigMap))
}

export const convertProductInfoWithPagination = (data: any, requestQuery) => {
  const {
    validationConfigMap, // 白名单配置
    queryCount,
    productList,
    totalCount,
    spuTopCount,
    spuSortType // 1: 手动排序 2: 智能排序
  } = (data || {}) as any
  const { pagination, statusList } = requestQuery
  return {
    list: convertProductInfoList(productList, validationConfigMap),
    pagination: {
      ...pagination,
      total: totalCount
    },
    statusList: statusList.map((node) => {
      const count = queryCount[node.key]
      return {
        ...node,
        count
      }
    }),
    sortInfo: {
      isSmartSort: spuSortType === 2,
      topCount: spuTopCount || 0
    }
  }
}
