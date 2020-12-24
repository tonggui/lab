import httpClient from '../../client/instance/medicineMerchant'
import {
  Pagination
} from '../../interface/common'
import {
  convertPoiList as convertPoiListFromServer
} from '../../helper/poi/convertFromServer'

export const getMerchantCommonInfo = () => httpClient.post('r/common', {})

export const getPoiList = ({ keyword, cityId, pagination }: {
  keyword: string,
  cityId: number,
  pagination: Pagination
}) => httpClient.post('r/listPaddingPoi', {
  pageSize: pagination.pageSize,
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

/**
 * 查询idList对应的门店信息
 * @param idList 输入的门店id
 * @param routerTagId 品类id
 */
export const getPoiInfoListByIdList = ({ idList, routerTagId }: {
  idList: number[],
  routerTagId: number
}) => httpClient.post('r/fillTargetPoi', {
  wmPoiIds: idList.join(','),
  routerTagId
}).then((data) => {
  data = (data || {}) as any
  return convertPoiListFromServer(data.wmPoiList || [])
})
