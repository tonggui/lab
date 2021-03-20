import httpClient from '../client/instance/merchant'

export const getBatchExcelTemplate = () => httpClient.post('hqcc/batch/r/config', {})

export const submitBatchCreateExcel = ({ wmPoiIds, file, fillPicBySp }: {
  wmPoiIds: number[],
  file: File,
  fillPicBySp: boolean
}) => httpClient.upload('hqcc/batch/w/createByExcel', {
  wmPoiIds, file, fillPicBySp
})

export const submitBatchModifyExcel = ({ wmPoiIds, file, matchType }: {
  wmPoiIds: number[],
  file: File,
  matchType: number
}) => httpClient.upload('hqcc/batch/w/updateByExcel', {
  wmPoiIds, file, matchType
})

export const submitBatchUploadImage = ({ wmPoiIds, file, picType, matchType }: {
  wmPoiIds: number[],
  file: File,
  picType: number,
  matchType: number
}) => httpClient.upload('hqcc/batch/w/uploadPic', {
  wmPoiIds, file, picType, matchType
})

export const submitBatchRel = ({ wmPoiIds, syncTagList }: {
  wmPoiIds: number[],
  syncTagList: object[]
}) => httpClient.post('hqcc/batch/w/rel', {
  wmPoiIds,
  syncTagList
})
// {
//   wmPoiIds: number[],
//     syncTagList: object[],
//   dataSourceType: number,
//   dataSourceValues: string[],
//   syncType: number,
//   excludeSyncContent: number[]
// }
// syncTagList, dataSourceType, dataSourceValues, syncType, excludeSyncContent
export const submitNewBatchRel = ({ wmPoiIds, params }) => httpClient.post('hqcc/batch/w/rel', {
  wmPoiIds,
  ...params
})

/**
 * 批量关联 - 任务完成确认
 * @param wmPoiIds
 * @param syncTagList
 */
export const batchRelConfirm = ({ taskType = 504 }: { taskType: number }) => httpClient.post('/hqcc/w/confirmTaskDone', {
  taskType
})
