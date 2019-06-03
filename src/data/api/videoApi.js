import apiClient from './client'

export const fetchVideoList = params =>
  apiClient.post('/reuse/product/food/video/r/list', params, {
    baseURL: '/api'
  }).then(data => {
    const { totalNum = 0, usage = 0, wmProductVideoVoList: list = [] } = data || {}
    return {
      totalNum, usage, list
    }
  })
