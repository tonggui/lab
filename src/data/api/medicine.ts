import httpClient from '../client/instance/product'
import {
  Pagination
} from '../interface/common'
import {
  BATCH_MATCH_TYPE,
} from '../enums/batch'
import {
  PRODUCT_STATUS
} from '../enums/product'
import {
  convertProductInfoWithPagination as convertProductInfoWithPaginationFromServer
} from '../helper/product/base/convertFromServer'
import {
  convertProductSuggestionList as convertProductSuggestionListFromServer
} from '../helper/common/convertFromServer'
import {
  convertTagWithSortList as convertTagWithSortListFromServer
} from '../helper/category/convertFromServer';

/**
 * 药品相关api
 */
// TODO
export const getMedicineInfoList = ({
  poiId,
  tagId,
  keyword,
  status,
  pagination,
  sorter,
  statusList,
  brandId,
  needTag
}: {
  poiId: number,
  tagId: number,
  keyword: string,
  status: PRODUCT_STATUS,
  sorter,
  statusList,
  pagination: Pagination,
  brandId: number,
  needTag: boolean
}) => httpClient.post('shangou/medicine/r/searchByCond', {
  wmPoiId: poiId,
  pageNum: pagination.current,
  pageSize: pagination.pageSize,
  needTag: needTag ? 1 : 0,
  name: '',
  brandId: brandId || 0,
  tagId,
  searchWord: keyword,
  state: status,
  sort: sorter
}).then(data => {
  const product = convertProductInfoWithPaginationFromServer(data, {
    pagination,
    statusList,
  })
  if (needTag) {
    const tagList = convertTagWithSortListFromServer(data.tagList)
    return {
      ...product,
      productTotal: data.totalCount,
      tagList
    }
  }
  return product
})

/**
 * 下载药品信息
 */
export const downloadMedicineList = ({ poiId }: { poiId: number }) => httpClient.post('shangou/medicine/r/downloadProductByExcel', {
  wmPoiId: poiId,
  v2: 1
})
/**
 * excel 批量创建
 * @param params
 */
export const submitBatchCreateByExcel = (params: {
  poiIdList: number[], // 门店列表
  multiPoiFlag: boolean, // 是否是多品类
  file: File, // excel文件
}) => {
  const { poiIdList, file, multiPoiFlag } = params
  const query = {
    multiPoiFlag,
    wm_poi_ids: poiIdList.join(','),
    wmPoiIds: poiIdList.join(','),
    updfile: file,
    wmPoiId: undefined,
    excelType: 3
  }
  return httpClient.upload('shangou/medicine/batch/w/saveByExcel', query)
}
/**
 * excel 批量修改
 * @param params
 */
export const submitBatchModifyByExcel = (params: {
  poiIdList: number[],
  multiPoiFlag: boolean, // 多品类标志
  excelType: BATCH_MATCH_TYPE, // excel的类型
  file: File // excel文件
}) => {
  const { poiIdList, multiPoiFlag, excelType, file } = params
  return httpClient.upload('shangou/medicine/batch/w/updateByExcel', {
    multiPoiFlag,
    excelType,
    wmPoiIds: poiIdList.join(','),
    updfile: file
  })
}
/**
 * 获取搜索关键字
 * @param poiId 门店id
 * @param keyword 关键字
 */
export const getSearchSuggestion = ({ poiId, keyword }) => httpClient.get('shangou/medicine/r/searchSug', {
  keyword,
  wmPoiId: poiId
}).then(data => {
  data = data || {}
  return convertProductSuggestionListFromServer(data.list)
})
