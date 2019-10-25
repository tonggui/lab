import apiClient from '../client/instance/product'
import {
  convertProductVideoFromServer
} from '../helper/product/base/convertFromServer'
import {
  convertProductVideoToServer
} from '../helper/product/base/convertToServer'

const isLocal = process.env.NODE_ENV === 'development'

// 视频文件上传接口url
export const uploadUrl = `${isLocal ? '/api' : ''}/reuse/sc/product/uploadTool/w/uploadVideoAndGetInfo`

// 获取视频中心列表
export const fetchVideoList = params =>
  apiClient.post('retail/video/r/list', { wmPoiId: params.poiId, ...params }).then(data => {
    data.list = (data.wmProductVideoVoList || []).map(convertProductVideoFromServer)
    return data
  })

// 删除视频
export const deleteVideo = params =>
  apiClient.post('retail/video/w/deleteById', { wmPoiId: params.poiId, ...params })

// 保存视频即编辑视频
export const saveVideo = (video, poiId) =>
  apiClient.post('retail/video/w/saveVideoInfo', {
    wmPoiId: poiId,
    wmProductVideoStr: JSON.stringify(convertProductVideoToServer(video))
  })

// 视频关联商品
export const relVideo = params =>
  apiClient.post('retail/video/w/saveProductRel', { wmPoiId: params.poiId, ...params })

// 轮询视频状态
export const fetchVideoStatus = videoId => apiClient.post('uploadTool/r/getVideoSourceStatus', { wmPoiId: undefined, videoId })
