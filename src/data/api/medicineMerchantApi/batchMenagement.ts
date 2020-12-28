import httpClient from '../../client/instance/medicineMerchant'

/**
 * 商家商品中心-批量管理-Excel模版获取
 * @param merchantId
 * @param status
 */
export const getBatchExcelTemlateMap = (params = {}) => {
  return httpClient.get('batch/r/config', params).then(data => data || {})
}

/**
 * 商家商品中心-批量管理-批量删除关联关系
 * @param merchantId
 * @param file
 */
export const postBatchDelRelation = ({ file }: {
    file: File,
  }) => {
  return httpClient.post('/batch/w/batchDeleteRelation', { file })
}

/**
 * 商家商品中心-批量管理-批量关联-新建关联关系
 * @param merchantId
 * @param file
 */
export const submitMedicineCreateBatchRel = ({ wmPoiIds, syncTagList }: {
  wmPoiIds: number[],
  syncTagList: object[]
}) => httpClient.post('batch/w/rel', {
  wmPoiIds,
  syncTagList
})
/**
 * 商家商品中心-批量管理-批量excel修改
 * @param merchantId
 * @param wmPoiIds 待关联的外卖门店ID
 * @param file 待上传的excel文件
 * @param matchType 匹配方式: 1:货号 2:upc 3:商品标题
 */
export const submitMedicineBatchModifyExcel = ({ wmPoiIds, file, matchType }: {
  wmPoiIds: number[],
  file: File,
  matchType: number
}) => httpClient.upload('batch/w/updateByExcel', {
  wmPoiIds, file, matchType
})
/**
 * 商家商品中心-批量管理-批量excel创建
 * @param merchantId
 * @param wmPoiIds 待关联的外卖门店ID
 * @param file 待上传的excel文件
 * @param fillPicBySp: boolean  是否使用标品库图片
 */
export const submitMedicineBatchCreateExcel = ({ wmPoiIds, file, fillPicBySp }: {
  wmPoiIds: number[],
  file: File,
  fillPicBySp: boolean
}) => httpClient.upload('/batch/w/batchAddByExcel', {
  wmPoiIds, file, fillPicBySp
})
