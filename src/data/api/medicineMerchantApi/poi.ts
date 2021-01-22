import httpClient from '../../client/instance/medicineMerchant'
import { updateMerchantConfig, ConfigKeys } from '@/common/merchant'

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

export const getAllPoiList = ({ keyword, cityId, exclude }: {
  keyword: string,
  cityId: number,
  exclude: number[]
}) => httpClient.post('r/listAllPaddingPoi', {
  name: keyword,
  cid: cityId,
  excludePoiIds: exclude
}).then(data => {
  const { list } = (data || {}) as any
  return convertPoiListFromServer(list || [])
})

/**
 * 获取编辑页配置信息
 */
export const getConfig = ({ categoryId } : { categoryId: number}) => httpClient.post('r/getConfig', {
  categoryId
}).then(data => {
  const { funcConfig = {}, spuFieldConfig = {}, skuFieldConfig = {} } = data
  return {
    field: { ...spuFieldConfig },
    skuField: { ...skuFieldConfig },
    features: { ...funcConfig }
  }
})

// 获取单门店是否关联医药商家商品中心 merchantType -> 0:未开通；1：商超；2：医药；
export const getPoiIsMedicineMerchant = () => httpClient.post('r/getMerchantTypeInfo').then(({ merchantId, merchantType }) => {
  const isMedicineMerchant = !!(merchantType === 2)
  if (isMedicineMerchant) {
    updateMerchantConfig(ConfigKeys.MERCHANT_ID, merchantId)
  }
  return isMedicineMerchant
})
