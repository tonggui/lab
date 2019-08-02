import httpClient from '../client/instance/merchant'
import {
  Pagination
} from '../interface/common'
import {
  convertPoiList as convertPoiListFromServer
} from '../helper/poi/convertFromServer'

export const getPoiList = ({ keyword, cityId, pagination }: {
  keyword: string,
  cityId: number,
  pagination: Pagination
}) => httpClient.post('hqcc/r/listPaddingPoi', {
  pagSize: pagination.pageSize,
  pageNum: pagination.current,
  name: keyword,
  cid: cityId
}).then(data => {
  const { list, total } = (data || {}) as any
  return {
    list: convertPoiListFromServer(list),
    pagination: {
      ...pagination,
      total: total || 0
    }
  }
})
