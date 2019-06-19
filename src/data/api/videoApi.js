import apiClient from './client'
import { convertProductVideoFromServer } from './helpers/video'

const isLocal = process.env.NODE_ENV === 'development'

// 视频文件上传接口url
export const uploadUrl = `${isLocal ? '/api' : ''}/reuse/sc/product/retail/uploadTool/w/uploadToVideoSpace`

// 获取视频中心列表
export const fetchVideoList = params =>
  apiClient.post('retail/video/r/list', params).then(data => {
    data.list = (data.wmProductVideoVoList || []).map(convertProductVideoFromServer)
    return data
  })

// 删除视频
export const deleteVideo = params =>
  apiClient.post('retail/video/w/deleteById', params)
