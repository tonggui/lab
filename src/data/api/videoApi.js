import apiClient from './client'
import { convertProductVideoFromServer } from './helpers/video'

const isLocal = process.env.NODE_ENV === 'development'

// 视频文件上传接口
export const uploadUrl = `${isLocal ? '/api' : ''}/reuse/sc/product/retail/uploadTool/w/uploadToVideoSpace`

export const fetchVideoList = params =>
  apiClient.post('/reuse/sc/product/retail/video/r/list', params, {
    baseURL: '/api'
  }).then(data => {
    data.list = (data.wmProductVideoVoList || []).map(convertProductVideoFromServer)
    return data
  })
