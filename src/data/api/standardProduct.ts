import httpClient from '../client/instance/product'
import {
  convertSpInfo as convertSpInfoFromServer,
  convertSpInfoList as convertSpInfoListFromServer,
  convertMedicineSpInfoList as convertMedicineSpInfoListFromServer,
  convertSpUpdateInfo as convertSpUpdateInfoFromServer,
  convertSpChangeInfo as convertSpChangeInfoFromServer
} from '../helper/product/standar/convertFromServer'
import {
  convertErrorRecoveryInfoToServer,
  convertMedicineSpInfo
} from '../helper/product/standar/convertToServer'
import { trimSplit } from '@/common/utils'
import {
  Pagination
} from '../interface/common'

/**
 * 通过upc码查询标品信息
 * @param upc upcCode
 */
export const getSpInfoByUpc = ({ upc, poiId }: { upc: string | number, poiId: string | number }) => httpClient.post('retail/r/getSpDetailByEan', {
  ean: upc,
  wmPoiId: poiId
}).then(data => {
  data = data || {}
  return convertSpInfoFromServer(data.product)
}).catch(err => {
  if (err.code === 2 && err.data) {
    const product = err.data.product
    if (product && product.category) {
      const category = product.category
      category.idPath = trimSplit(category.idPath).map(v => +v)
      category.namePath = trimSplit(category.namePath)
      err.data = { category }
    } else {
      err.data = null
    }
  }
  throw err
})
/**
 * 根据标品id查询标品信息
 * @param id 标品id
 */
export const getSpInfoById = ({ id, poiId }: { id: number, poiId: number|string }) => httpClient.post('retail/r/getSpDetailBySpId', {
  spId: id,
  wmPoiId: poiId
}).then(data => {
  data = data || {}
  return convertSpInfoFromServer(data.product)
})
/**
 * 查询热销标品列表
 * @param poiId 门店id
 * @param pagination 分类信息
 * @param product 商品信息
 * @param sortType 排序类型
 */
export const getHotSpList = ({
  poiId,
  pagination,
  name,
  upc,
  brandId,
  categoryId,
  keyword,
  sortType
}: {
  pagination: Pagination,
  sortType?: number,
  name: string,
  upc: string,
  keyword?: string,
  brandId: number,
  categoryId: number,
  poiId?: number
}) => httpClient.post('retail/r/getSpCellularTopSalesWithCond', {
  pageNo: pagination.current,
  pageSize: pagination.pageSize,
  upc,
  brandId,
  categoryId,
  productName: name,
  keyword: keyword || '',
  sortType,
  wmPoiId: poiId
}).then(data => {
  const { list, total } = data
  return {
    list: convertSpInfoListFromServer(list),
    pagination: {
      ...pagination,
      total
    }
  }
})
/**
 * 查询标品列表
 * @param poiId 门店id
 * @param pagination 分类信息
 * @param product 商品信息
 * @param sortType 排序类型
 */
export const getSpList = ({
  poiId,
  pagination,
  name,
  upc,
  brandId,
  categoryId,
  sortType,
  keyword
}: {
  pagination: Pagination,
  keyword: string,
  sortType?: number,
  name: string,
  upc: string,
  brandId: number,
  categoryId: number,
  poiId?: number
}) => httpClient.post('retail/r/getStandardProductListWithCond', {
  pageNo: pagination.current,
  pageSize: pagination.pageSize,
  upc,
  brandId,
  categoryId,
  keyword,
  productName: name,
  sortType,
  wmPoiId: poiId
}).then(data => {
  const { list, totalCount: total } = data
  return {
    list: convertSpInfoListFromServer(list),
    pagination: {
      ...pagination,
      total
    }
  }
})

/**
 * 查询药品标品列表
 * @param poiId 门店id
 * @param pagination 分类信息
 * @param product 商品信息
 */
export const getMedicineSpList = ({
  poiId,
  pagination,
  name,
  upc,
  permissionNumber,
  tagCode
}: {
  pagination: Pagination,
  name: string,
  upc: string,
  permissionNumber: number,
  tagCode: number,
  poiId?: number
}) => httpClient.post('shangou/sp/r/searchSpListByCond', {
  pageNum: pagination.current,
  pageSize: pagination.pageSize,
  upcCode: upc,
  name,
  approvalNumber: permissionNumber,
  catCode: tagCode,
  wmPoiId: poiId
}).then(data => {
  const { list, total } = data.data
  // 是否存在未审核数据
  const hasAuditingData = !!data.hasAuditingData
  // 未审核数据的状态
  const hasAuditingStatus = data.hasAuditingStatus
  return {
    list: convertMedicineSpInfoListFromServer(list),
    pagination: {
      ...pagination,
      total
    },
    hasAuditingData,
    hasAuditingStatus
  }
})

/**
 * 查询爆品推荐的标品列表
 * @param poiId 门店id
 * @param pagination 分类信息
 * @param product 商品信息
 * @param sortType 排序类型
 */
export const getHotRecommendSpList = ({
  poiId,
  pagination,
  name,
  upc,
  brandId,
  categoryId,
  sortType
}: {
  pagination: Pagination,
  sortType?: number,
  name: string,
  upc: string,
  brandId: number,
  categoryId: number,
  poiId?: number
}) => httpClient.post('retail/r/getScPoiHotSales', {
  pageNo: pagination.current,
  pageSize: pagination.pageSize,
  upc,
  brandId,
  categoryId,
  productName: name,
  sortType,
  scPoiId: poiId
}).then(data => {
  const { list, totalCount: total } = data
  return {
    list: convertSpInfoListFromServer(list),
    pagination: {
      ...pagination,
      total
    }
  }
})

/**
 * 获取标品更新信息
 * @param id 标品id
 */
export const getSpChangeInfoById = ({ id, poiId }) => httpClient.post('retail/v2/r/getProductChangeInfo', {
  spuId: id,
  wmPoiId: poiId
}).then(data => convertSpChangeInfoFromServer(data))
/**
 * TODO 降级暂时留存
 * 获取标品更新信息
 * @param id 标品id
 */
export const getSpUpdateInfoById = ({ id, poiId }) => httpClient.post('retail/v2/r/getChangeInfo', {
  spuId: id,
  wmPoiId: poiId
}).then(data => convertSpUpdateInfoFromServer(data))
/**
 * 提交纠错信息
 * @param poiId 门店id
 * @param spuId 商品id
 * @param fieldList 纠错信息
 */
export const submitSpErrorRecovery = ({
  poiId, spuId, fieldList
}: { poiId: number, spuId: number, fieldList }) => httpClient.post('errorrecovery/w/batchSave', {
  saveErrorRecovery: JSON.stringify({ wmPoiId: poiId, spuId, fieldList: convertErrorRecoveryInfoToServer(fieldList) })
})
/**
 * 中间态批量生成商品
 * @param list [{ wm_poi_id, sp_id  }]  wm_poi_id为门店id, sp_id为商品库中的商品id
 * @return {*}
 */
export const submitBatchSaveProductBySp = ({ idList, poiId }) => {
  const data = idList.map(id => ({ wm_poi_id: poiId, sp_id: id }))
  return httpClient.post('retail/w/batchAddProductUnreleasedForAddSpu', {
    listJson: JSON.stringify(data)
  })
}

/**
 * 批量生成药品
 */
export const submitBatchSaveMedicineProductBySp = ({ spList, poiId }) => {
  const data = spList.map(convertMedicineSpInfo)
  return httpClient.post('shangou/sp/w/addSpProductToPoi', {
    wmPoiId: poiId,
    listJson: JSON.stringify(data)
  })
}

/**
 * 查询爆款推荐商品信息
 * @param options 请求参数
 * @return {*}
 */
export const fetchHotRecommendData = options => httpClient.post('retail/r/getScPoiHotSales', options)
