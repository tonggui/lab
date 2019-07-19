import httpClient from '../client/instance/product'
import {
  convertSpInfo as convertSpInfoFromServer,
  convertSpInfoList as convertSpInfoListFromServer,
  convertSpUpdateInfo as convertSpUpdateInfoFromServer
} from '../helper/product/standar/convertFromServer'
import {
  Pagination
} from '../interface/common'

/**
 * 通过upc码查询标品信息
 * @param upc upcCode
 */
export const getSpInfoByUpc = ({ upc }: { upc: string | number }) => httpClient.post('retail/r/getSpDetailByEan', {
  ean: upc
}).then(data => {
  data = data || {}
  return convertSpInfoFromServer(data.product)
})
/**
 * 根据标品id查询标品信息
 * @param id 标品id
 */
export const getSpInfoById = ({ id }: { id: number }) => httpClient.post('retail/r/getSpDetailBySpId', {
  spId: id
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
  sortType
}: {
  pagination: Pagination,
  sortType?: number,
  name: string,
  upc: string,
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
  sortType,
  wmPoiId: poiId,
}).then(data => {
  const { list, total } = data
  return {
    list: convertSpInfoListFromServer(list),
    pagination: {
      ...pagination,
      total,
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
  sortType
}: {
  pagination: Pagination,
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
  productName: name,
  sortType,
  wmPoiId: poiId,
}).then(data => {
  const { list, totalCount: total } = data
  return {
    list: convertSpInfoListFromServer(list),
    pagination: {
      ...pagination,
      total,
    }
  }
})

/**
 * 获取标品更新信息
 * @param id 标品id
 */
export const getSpUpdateInfoById = ({ id }) => httpClient.post('retail/v2/r/getChangeInfo', {
  spuId: id,
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
  saveErrorRecovery: JSON.stringify({ wmPoiId: poiId, spuId, fieldList })
})
/**
 * 中间态批量生成商品
 * @param list [{ wm_poi_id, sp_id  }]  wm_poi_id为门店id, sp_id为商品库中的商品id
 * @return {*}
 */
export const submitBatchSaveProductBySp = (list) => {
  const data = list.map(({ poiId, spId }) => ({ wm_poi_id: poiId, sp_id: spId }))
  return httpClient.post('retail/w/batchAddProductUnreleasedForAddSpu', {
    listJson: JSON.stringify(data)
  })
}
