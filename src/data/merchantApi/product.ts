import httpClient from '../client/instance/merchant'
import {
  Pagination, TaskInfo
} from '../interface/common'
import {
  AuditProductInfo
} from '../interface/product'
import {
  BaseCategory
} from '../interface/category'
import {
  AuditTriggerMode,
  MERCHANT_PRODUCT_STATUS,
  PRODUCT_SELL_STATUS,
  PRODUCT_STOCK_STATUS,
  PRODUCT_AUDIT_STATUS
  // MERCHANT_OPEN_STATUS
} from '../enums/product'
import {
  convertMerchantProductList as convertMerchantProductListFromServer,
  convertProductDetail as convertProductDetailWithCategoryAttrFromServer,
  convertAuditProductDetail
} from '../helper/product/merchant/convertFromServer'
import {
  convertProductSuggestionList as convertProductSuggestionListFromServer
} from '../helper/common/convertFromServer'
import {
  convertPoiList as convertPoiListFromServer
} from '../helper/poi/convertFromServer'
import {
  convertProductToServer
} from '../helper/product/merchant/convertToServer'
import { defaultTo } from 'lodash'
import { trimSplit, trimSplitId, setHeaderMContext } from '@/common/utils'
// import { getCookie } from '@utiljs/cookie';
// import {
//   convertAuditProductDetail
// } from '../helper/product/auditProduct/convertFromServer'

/**
 * 获取商家状态
 */
export const getMerchantOpenStatus = () => httpClient.post('hqcc/manage/r/getRelateMerUnionStatus').then(data => {
  const {
    merStatus,
    resetTaskStatus,
    closeTaskStatus
  } = data
  return {
    closeTaskStatus,
    resetTaskStatus,
    merStatus
  }
})

/**
 * 查询正在执行的任务
 */
export const getRunningTaskStatus = ({ taskType }) => httpClient.post('hqcc/manage/r/runningTask', {
  taskType
}).then(data => {
  const {
    taskId,
    taskName,
    status,
    ctime,
    resultStatus,
    resultDesc = {}
  } = data

  return {
    id: taskId,
    name: taskName,
    status,
    ctime,
    resultStatus,
    resultDesc: typeof resultDesc === 'string' ? JSON.parse(resultDesc) : resultDesc
  }
})

/**
 * 提交重置任务
 */
export const getResetMerchant = () => httpClient.post('hqcc/manage/w/reset')

/**
 * 提交关闭任务
 * @param params
 */
export const getCloseMerchant = () => httpClient.post('hqcc/manage/w/close')

/**
 * 任务确认完成
 * @param params
 */
export const getTaskFinish = ({ taskId }) => httpClient.post('hqcc/manage/w/finishTask', {
  taskId: taskId || ''
})

export const getProductList = (params) => {
  const { pagination, keyword, tagId, includeStatus, needTags, brandId, status, startCTime } = params
  return httpClient.post('hqcc/r/listProduct', {
    startCTime,
    keyWords: keyword || '',
    tagId,
    includeStatus,
    needTags: needTags,
    brandId: brandId || 0,
    pageSize: pagination.pageSize,
    pageNum: pagination.current,
    missingRequiredInfo: status === MERCHANT_PRODUCT_STATUS.MISSING_INFORMATION ? 1 : 0
  }).then(data => {
    const { pageNum, pageSize, totalCount, products, queryCount } = (data || {}) as any
    return {
      pagination: {
        ...pagination,
        current: pageNum,
        pageSize,
        total: totalCount
      },
      statistics: queryCount,
      list: convertMerchantProductListFromServer(products)
    }
  })
}

/**
 * 获取商品类目申报信息
 * @param id 商品id
 * @param poiId 门店id
 */
export const getCategoryAppealInfo = ({ id }: { id: number }) => httpClient.post('hqcc/r/getCategoryAppealInfo', {
  spuId: id
})
// 品牌提报
export const submitApplyBrand = ({ name, logoPic, brandUrl }: {
  name: string, // 品牌名称
  logoPic: string, // 品牌logo图片
  brandUrl: string // 品牌连接地址
}) => httpClient.upload('hqcc/w/saveApplyBrand', {
  name,
  logoPic,
  brandUrl
})

export const submitIncludeProduct = ({ spuIdList }: { spuIdList: number[] }) => httpClient.post('hqcc/w/includeProduct', { spuIds: spuIdList.join(',') })

export const getSearchSuggestion = ({ keyword, auditStatus, includeStatus } : { keyword: string, auditStatus: PRODUCT_AUDIT_STATUS[], includeStatus: number | undefined }) => httpClient.post('hqcc/r/searchSug', {
  includeStatus,
  keyword,
  auditStatus
}).then(data => {
  data = data || []
  return convertProductSuggestionListFromServer(data)
})

export const submitModProductSellStatus = ({ idList, sellStatus }: { idList: number[], sellStatus: PRODUCT_SELL_STATUS }) => httpClient.post('hqcc/w/batchSetSaleStatus', {
  spuIds: idList,
  sellStatus: sellStatus
})

export const submitDeleteProduct = ({ idList, isMerchantDelete, isSelectAll, poiIdList } : { idList: number[], isMerchantDelete: boolean, isSelectAll: boolean, poiIdList: number[] }) => httpClient.post('hqcc/w/batchDelete', {
  spuIds: idList,
  isOnlyDeleteMerchant: isMerchantDelete ? 1 : 2,
  isSelectAll: isSelectAll ? 1 : 2,
  wmPoiIds: poiIdList
})

export const submitSaveOrder = (params) => httpClient.post('hqcc/w/saveTagSequence', params)

export const submitSaveOrderWithSync = (params) => httpClient.post('hqcc/w/syncTagSequence', params)

export const getProductRelPoiList = ({
  pagination,
  spuId,
  filters
} : {
  pagination: Pagination,
  spuId: number,
  filters: {
    poiId?: number,
    exist: number,
    sellStatus?: PRODUCT_SELL_STATUS,
    minPrice?: number,
    maxPrice?: number,
    stockStatus?: PRODUCT_STOCK_STATUS
  }
}) => httpClient.post('hqcc/r/listRelPoi', {
  pageSize: pagination.pageSize,
  pageNum: pagination.current,
  spuId,
  poiId: defaultTo(filters.poiId, ''),
  exist: filters.exist,
  sellStatus: defaultTo(filters.sellStatus, PRODUCT_SELL_STATUS.ALL),
  minPrice: defaultTo(filters.minPrice, -1),
  maxPrice: defaultTo(filters.maxPrice, -1),
  stockStatus: defaultTo(filters.stockStatus, PRODUCT_STOCK_STATUS.ALL)
}).then(data => {
  data = data || {}
  const { list, totalCount } = data
  const page = {
    ...pagination,
    total: totalCount || 0
  }
  const spu = data.spu || {}
  const product = {
    id: spu.id,
    name: spu.name,
    upcCode: spu.upc,
    skuCode: spu.skuCode,
    picture: spu.pic,
    poiIdList: spu.poiIds || []
  }
  return {
    pagination: page,
    product,
    list: (list || []).map(({ poiId, ...rest }) => ({ id: poiId, ...rest }))
  }
})

export const submitClearRelPoi = ({ poiIdList, spuId } : { poiIdList: number[], spuId: number }) => httpClient.post('hqcc/w/cancelSpuPoiRel', {
  wmPoiIds: poiIdList,
  spuId
})

export const submitPoiProductSellStatus = ({ poiIdList, spuId, sellStatus } : { poiIdList: number[], spuId: number, sellStatus: PRODUCT_SELL_STATUS }) => httpClient.post('hqcc/w/setSpuSaleStatus', {
  wmPoiIds: poiIdList,
  spuId,
  sellStatus
})

export const submitModProductSkuPrice = ({ spuId, poiIdList, skuIdPriceMap, isSelectAll } : { spuId: number, poiIdList: number[], skuIdPriceMap: ({ skuId: number, price: number, isChanged: boolean })[], isSelectAll: boolean }) => {
  return httpClient.post('hqcc/w/updatePrice', {
    spuId,
    wmPoiIds: poiIdList,
    skuPriceVoList: skuIdPriceMap,
    isUpdateAllPoi: isSelectAll
  })
}
/**
 * 获取商家商品中心是否命中需送审的条件
 * @param categoryId 类目id
 * @param poiId 门店id
 */
export const getNeedAudit = ({ categoryId }: { categoryId: number }) =>
  httpClient.post('/hqcc/audit/r/needAudit', {
    categoryId
  }).then((data = {
    meetPoiCondition: false,
    meetCategoryCondition: false
  }) => ({ poiNeedAudit: !!data.meetPoiCondition, categoryNeedAudit: !!data.meetCategoryCondition }))

export const submitModProductSkuStock = ({ spuId, poiIdList, skuIdStockMap, isSelectAll } : { spuId: number, poiIdList: number[], skuIdStockMap: ({ skuId: number, stock: number, isChanged: boolean })[], isSelectAll: boolean }) => {
  return httpClient.post('hqcc/w/updateStock', {
    spuId,
    wmPoiIds: poiIdList,
    skuStockVoList: skuIdStockMap,
    isUpdateAllPoi: isSelectAll
  })
}

export const submitAddRelPoi = ({ poiIdList, spuId, traceId } : { poiIdList: number[], spuId: number, traceId:string }) => httpClient.post('hqcc/w/addSpuPoiRels', {
  spuId,
  poiIds: poiIdList
}, {
  headers: {
    'M-Context': setHeaderMContext({
      biz: '单个商品编辑关联门店数（商家商品中心）',
      id: traceId
    })
  }
})
/**
 * 商家商品中心编辑页商品详情
 * @param params
 */
export const getProductDetail = (params) => httpClient.post('hqcc/r/detailProduct', params)
  .then(convertProductDetailWithCategoryAttrFromServer)

/**
 * 商家商品中心审核列表查看商品详情
 * @param params
 */
export const getAuditProductDetail = (params) => httpClient.post('/hqcc/audit/r/detail', params)
  .then(convertAuditProductDetail)

/**
 * 商家商品中心保存撤销接口
 * @param params
 */
export const getProductRevocation = ({ spuId } : { spuId: number }) => httpClient.post('/hqcc/audit/w/cancel', {
  spuId
})

/**
 * 商家商品中心保存接口
 * @param product
 * @param context
 */
export const submitProductInfo = (product, context, extra) => {
  const params = convertProductToServer(product, context)
  const { ignoreSuggestCategory, suggestCategoryId, isNeedCorrectionAudit, needAudit, saveType = undefined, isAuditFreeProduct, usedSuggestCategory = false } = context
  params.skipAudit = isAuditFreeProduct
  params.ignoreSuggestCategory = ignoreSuggestCategory
  params.suggestCategoryId = suggestCategoryId
  params.useSuggestCategory = usedSuggestCategory
  params.saveType = saveType || (needAudit ? 2 : 1) // 保存状态：1-正常保存; 2-提交审核; 3-重新提交审核(目前仅在审核中)
  params.auditSource = isNeedCorrectionAudit ? 2 : 1 // 数据来源：1-商家提报; 2-商家纠错
  return httpClient.post('hqcc/w/saveOrUpdateProduct', params, {
    headers: {
      'M-Context': setHeaderMContext({
        biz: extra.biz,
        id: extra.traceId,
        ext: extra.ext
      })
    }
  })
}

export const submitDownloadProduct = () => httpClient.post('hqcc/r/addDownload')

export const getDownloadTaskList = () => httpClient.get('hqcc/r/downloadList').then(data => {
  let { list } = (data || {}) as any
  list = list || []
  // 0未生成1生成中2生成成功3生成失败
  return list.map((i) => {
    let status = 1
    if (i.status === 1) {
      status = 0
    }
    let result = 0
    if (i.status === 2) {
      result = 1
    }
    const task: TaskInfo = {
      id: i.id,
      name: i.name,
      time: i.time,
      utime: i.utime,
      ctime: i.ctime,
      status,
      result,
      output: i.url
    }
    return task
  })
})

export const getProductAllRelPoiList = ({ spuId, excludeList, poiIdList } : { spuId: number, excludeList: number[], poiIdList?: number[] }) => httpClient.post('hqcc/r/listAllRelPoi', {
  spuId,
  excludePoiIds: excludeList,
  poiIds: poiIdList || []
}).then(data => {
  const { list } = (data || {}) as any
  return convertPoiListFromServer(list)
})
/**
 * https://km.sankuai.com/page/164131116
 * @param spuIdList 商品idList
 * @param type 删除范围，1: 总部 2: 全部门店
 */
export const deleteApproveProduct = ({ spuIdList, isMerchant } : { spuIdList: number[], isMerchant: boolean }) => httpClient.post('hqcc/w/deleteProductInAppending', {
  spuIds: spuIdList,
  type: isMerchant ? 1 : 2
})

export const submitUpdateProductSequence = ({ spuId, sequence, tagId } : { spuId: number, sequence: number, tagId: number }) => httpClient.post('hqcc/w/updateTagProductSequence', {
  tagId,
  spuId,
  sequence
})

export const submitAsyncProductSequence = ({ tagId, isSelectAll, poiIdList } : { tagId: number, isSelectAll: boolean, poiIdList: number[] }) => httpClient.post('hqcc/w/syncTagProductSequence', {
  tagId,
  isUpdateAllPoi: isSelectAll,
  wmPoiIds: poiIdList
})

export const submitCancelProductAudit = ({ spuId } : { spuId: number }) => httpClient.post('hqcc/w/auditCancel', { spuId })

export const getAuditProductList = ({ pagination, searchWord, auditStatus } : {
  pagination: Pagination,
  searchWord: string,
  auditStatus: PRODUCT_AUDIT_STATUS[]
}) => httpClient.post('hqcc/audit/r/List', {
  auditStatus,
  pageNum: pagination.current,
  pageSize: pagination.pageSize,
  keyWord: searchWord || ''
}).then(data => {
  const { totalCount, productList = [] } = (data || {}) as any
  return {
    pagination: {
      ...pagination,
      total: totalCount || 0
    },
    list: (productList || []).map(product => {
      const category: BaseCategory = {
        id: product.categoryId,
        idPath: trimSplitId(product.categoryIdPath),
        name: product.categoryName,
        namePath: trimSplit(product.categoryNamePath)
      }
      const node: AuditProductInfo = {
        id: product.id,
        name: product.name,
        pictureList: (product.picture && [product.picture]) || product.pictures || [],
        upcCode: product.upcCode,
        auditStatus: product.auditStatus,
        category,
        ctime: product.auditCreateTime || undefined,
        auditUpdateTime: product.auditUpdateTime || undefined,
        triggerMode: product.saveOrUpdate || AuditTriggerMode.UNKNOWN,
        hasModifiedByAuditor: !!product.auditUpdateData
      }
      return node
    })
  }
})

/**
 * 下载门店商品
 * @param poiId 门店id
 */
export const downloadProductList = () => httpClient.post('hqcc/r/downloadMerchantProductByExcel')

/**
 * 查询未关联的总部商品数量
 */
// export const getUnRelatedProductCount = () => httpClient.post('hqcc/r/getUnRelatedProductCount')
