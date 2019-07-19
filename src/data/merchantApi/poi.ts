import httpClient from '../client/instance/merchant'
import {
  Pagination
} from '../interface/common'
import {
  convertPoiList as convertPoiListFromServer
} from '../helper/poi/convertFromServer'
/**
 * 获取门店列表
 * @param routerTagId 品类id
 * @param keyword 关键词
 * @param pagination 分页信息
 */
export const getPoiList = ({ keyword, cityId, pagination }: {
  keyword: string,
  cityId: number,
  pagination: Pagination
}) => httpClient.post('hqcc/r/listSuggestPoi', {
  pagSize: pagination.pageSize,
  pageNum: pagination.current,
  name: keyword,
  cid: cityId
}).then(data => {
  const { list, totalCount } = data
  return {
    list: convertPoiListFromServer(list),
    pagination: {
      ...pagination,
      total: totalCount
    }
  }
})
