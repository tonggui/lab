import apiClient from './client'

export const fetchVideoList = params =>
  apiClient.post('retail/video/r/list', params).then(data => {
    const { total = 0, usage = 0, wmProductVideoVoList: list = [] } = data || {}
    return {
      total, usage, list
    }
  })
