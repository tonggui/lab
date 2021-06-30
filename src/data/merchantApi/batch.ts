import httpClient from '../client/instance/merchant'
import { setHeaderMContext } from '@/common/utils'

export const getBatchExcelTemplate = () => httpClient.post('hqcc/batch/r/config', {})

export const submitBatchCreateExcel = ({ wmPoiIds, file, fillPicBySp, traceObj }: {
  wmPoiIds: number[],
  file: File,
  fillPicBySp: boolean,
  traceObj: any
}) => {
  let headers = {}

  headers = {
    'M-Context': setHeaderMContext({
      biz: '批量Excel新建（商家商品中心）',
      id: traceObj.traceId,
      ext: traceObj.isStandard ? '调用基础库数据' : '不调用基础库数据'
    })
  }
  return httpClient.upload('hqcc/batch/w/createByExcel', {
    wmPoiIds, file, fillPicBySp
  }, {
    headers
  }, {
    hasServerTime: true
  })
}

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
export const submitNewBatchRel = ({ wmPoiIds, params, traceId }) => httpClient.post('hqcc/batch/w/rel', {
  wmPoiIds,
  ...params
}, {
  headers: {
    'M-Context': setHeaderMContext({
      biz: '批量关联（商家商品中心）',
      id: traceId
    })
  }
}, { hasServerTime: true })

/**
 * 批量关联 - 任务完成确认
 * @param wmPoiIds
 * @param taskType { 12003: 批量关联 }
 */
export const batchRelConfirm = ({ taskType = 12003 }: { taskType: number }) => httpClient.post('/hqcc/w/confirmTaskDone', {
  taskType
})
