import httpClient from '../client/instance/product'
import {
  Pagination
} from '../interface/common'
import {
  Product
} from '../interface/product'
import {
  BaseTag
} from '../interface/category'
import {
  convertTaskList as convertTaskListFromServer
} from '../helper/common/convertFromServer'
import {
  convertProductDetail as convertProductDetailToServer
} from '../helper/product/base/convertToServer'
import {
  convertCategoryAttrList as convertCategoryAttrListToServer
} from '../helper/product/withCategoryAttr/convertToServer'
import { setHeaderMContext, getSourceRole } from '@/common/utils'
import {
  BATCH_SYNC_CONTENT_TYPE,
  BATCH_SYNC_TYPE,
  BATCH_NEW_STUFF,
  BATCH_MATCH_TYPE,
  BATCH_UPLOAD_IMG_TYPE
} from '../enums/batch'

/**
 * 获取批量同步任务列表
 * @param pagination 分页信息
 */
export const getBatchSyncTaskList = (pagination: Pagination) => httpClient.post('retail/sync/task/r/list', {
  pageSize: pagination.pageSize,
  pageNum: pagination.current
}).then(data => {
  data = data || {}
  return {
    pagination: {
      ...pagination,
      total: data.totalSize
    },
    list: convertTaskListFromServer(data.data)
  }
})
/**
 * 创建批量同步
 * @param params
 */
export const submitBatchSync = ({ syncParam, routerTagId }: {
  routerTagId: number, // 品类id
  syncParam: {
    brand?: boolean, // 是否大连锁 qb端参数
    headPoiId: number, // 主门店id
    branchPoiIdList: number[], // 目标门店id
    syncContent: BATCH_SYNC_CONTENT_TYPE[], // 批量同步内容
    syncType: BATCH_SYNC_TYPE, // 同步类型
    newStuffSyncContent: BATCH_NEW_STUFF[], // 新品
    syncTagList: number[] // 同步的分类id
  }
}) => httpClient.post('retail/sync/w/submit', {
  syncParam: JSON.stringify(syncParam),
  routerTagId
})
/**
 * 获取批量同步的·连锁·描述
 */
export const getBatchSyncBrandDesc = (): () => string => httpClient.post('sync_food/pageInfo')
  .then(data => {
    data = data || {}
    const { brandMessage } = data
    return brandMessage || ''
  })
/**
 * 批量上传商品
 * @param poiIdList 门店id列表
 * @param product 商品信息
 * @param context 其余信息
 */
export const submitBatchCreateByProduct = ({ poiIdList, product, context = {}, extra } : {
  poiIdList: number[], // 门店id列表
  product: Product, // 商品信息
  context: {
    [propName: string]: any
  }, // 额外信息
  extra: any
}) => {
  const newProduct = convertProductDetailToServer(product)
  const tag = (product.tagList[0] || {}) as BaseTag
  delete newProduct.tagList
  const { validType = 0 } = context
  const params: any = {
    ...newProduct,
    validType, // 忽略错误项校验
    wm_poi_ids: poiIdList.join(','),
    sub_tag_name: tag.subTagName || '',
    tagName: tag.name
  }
  const { categoryAttrList, categoryAttrValueMap } = product
  const { categoryAttrMap, spuSaleAttrMap } = convertCategoryAttrListToServer(categoryAttrList!, categoryAttrValueMap)
  params.categoryAttrStr = JSON.stringify(categoryAttrMap)
  params.spuSaleAttrStr = JSON.stringify(spuSaleAttrMap)
  return httpClient.post('retail/batch/w/v3/save', params, {
    headers: {
      'M-Context': setHeaderMContext({
        biz: extra.biz,
        id: extra.traceId,
        ext: extra.ext
      })
    }
  })
}
/**
 * 通过excel批量创建
 * @param params
 */
export const submitBatchCreateByExcel = (params: {
  poiIdList: number[], // 门店列表
  multiPoiFlag: boolean, // 是否是多品类
  file: File, // excel文件
  useSpLibPicture: boolean // 是否使用标品库图片
  traceObj: any // headers上唯一任务标识
}) => {
  const { poiIdList, file, multiPoiFlag, useSpLibPicture, traceObj } = params
  const query = {
    multiPoiFlag,
    wm_poi_ids: poiIdList.join(','),
    uploadfile: file,
    fillPicBySp: !!useSpLibPicture
  }
  let headers = {}

  if (multiPoiFlag) {
    headers = {
      'M-Context': setHeaderMContext({
        biz: getSourceRole() === 'XF' ? '批量Excel新建批量生成（跨店）' : '批量Excel新建批量生成（跨店）',
        id: traceObj.traceId,
        ext: traceObj.isStandard ? '调用基础库数据' : '不调用基础库数据'
      })
    }
  } else {
    headers = {
      'M-Context': setHeaderMContext({
        biz: '批量Excel新建（单店）',
        id: traceObj.traceId,
        ext: traceObj.isStandard ? '调用基础库数据' : '不调用基础库数据'
      })
    }
  }
  return httpClient.upload('retail/batch/w/v3/saveProductAndMedicineByExcel', query, {
    headers
  }, { hasServerTime: true })
}
/**
 * 批量删除
 * @param params
 */
export const submitBatchDelete = (params: {
  matchRuleList: object[],
  poiIdList: number[]
}) => httpClient.post('food/batch/w/batchDelete', {
  matchingRulesJson: JSON.stringify(params.matchRuleList),
  wmPoiIds: params.poiIdList.join(','),
  v2: 1,
  wmPoiId: undefined
})
/**
 * 通过excel批量修改
 * @param params
 */
export const submitBatchModifyByExcel = (params: {
  poiIdList: number[],
  multiPoiFlag: boolean, // 多品类标志
  excelType: BATCH_MATCH_TYPE, // excel的类型
  file: File // excel文件
}) => {
  const { poiIdList, multiPoiFlag, excelType, file } = params
  const query = {
    excelType,
    uploadfile: file,
    multiPoiFlag,
    wmPoiIds: poiIdList.join(',')
  }
  return httpClient.upload('retail/batch/w/v3/updateProductAndMedicineByExcel', query)
}
/**
 * 单商品批量修改
 * @param params
 */
export const submitBatchModifyByProduct = (params: {
  poiIdList: number[],
  matchRuleList: object[],
}) => httpClient.post('food/batch/w/batchUpdate', {
  wmPoiIds: params.poiIdList.join(','),
  matchingRulesJson: JSON.stringify(params.matchRuleList)
  // wmPoiId: undefined,
})
/**
 * 批量上传图片
 * @param params
 */
export const submitBatchUploadImg = (params: {
  poiId: number,
  type: BATCH_UPLOAD_IMG_TYPE,
  file: File
}) => {
  const { poiId, type, file } = params
  return httpClient.upload('food/batch/w/uploadImgs', {
    file,
    wmPoiId: poiId,
    busType: type,
    v2: 1
  })
}

/**
 * 批量新建查询
 * @param poiId
 */
export const getRetailBatchInsertTask = (poiId: number) => {
  return httpClient.post('task/r/getRetailBatchInsertTask', {
    wmPoiId: poiId
  })
}

/**
 * 批量新建查询
 * @param taskId
 */
export const finishBatchInsertNew = (taskId: number) => {
  return httpClient.post('task/w/finishBatchInsertNew', {
    taskId
  })
}

/**
 * 新版批量新建灰度
 * @param poiId
 */
let inGreyCache
export const inBatchInsertNewGrey = async (poiId: number) => {
  if (inGreyCache !== undefined) return { inGrey: inGreyCache }
  const res = await httpClient.post('retail/r/inBatchInsertNewGrey', {
    wmPoiId: poiId
  })
  const { inGrey } : { inGrey: boolean } = res || {}
  inGreyCache = inGrey
  return { inGrey }
}
