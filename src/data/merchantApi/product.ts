import httpClient from '../client/instance/merchant'
import {
  Pagination, TaskInfo
} from '../interface/common'
import {
  PRODUCT_SELL_STATUS
} from '../enums/product'
import {
  convertMerchantProductList as convertMerchantProductListFromServer,
  convertProductDetail as convertProductDetailWithCategoryAttrFromServer
} from '../helper/product/merchant/convertFromServer'
import {
  convertSpUpdateInfo as convertSpUpdateInfoFromServer
} from '../helper/product/standar/convertFromServer'
import {
  convertProductSuggestionList as convertProductSuggestionListFromServer
} from '../helper/common/convertFromServer'
import {
  convertPoiList as convertPoiListFromServer
} from '../helper/poi/convertFromServer'
import {
  convertProductToServer
} from '../helper/product/merchant/convertToServer'
import { defaultTo } from 'lodash'
import { customWrapAkitaBusiness } from '@/common/akita'
import { BUSINESS_MODULE as MODULE, MODULE_SUB_TYPE as TYPE } from '@/common/akita/business_indexes'

export const getCategoryAttrSwitch = () => {
  return httpClient.post('hqcc/r/getCategoryAttrSwitch').then(data => data && data.categoryAttrSwitch)
}

export const getProductList = (params) => {
  const { pagination, keyword, tagId, includeStatus, needTags, brandId } = params
  return httpClient.post('hqcc/r/listProduct', {
    keyWords: keyword || '',
    tagId,
    includeStatus,
    needTags: needTags,
    brandId: brandId || 0,
    pageSize: pagination.pageSize,
    pageNum: pagination.current
  }).then(data => {
    const { pageNum, pageSize, totalCount, products } = (data || {}) as any
    return {
      pagination: {
        ...pagination,
        current: pageNum,
        pageSize,
        total: totalCount
      },
      list: convertMerchantProductListFromServer(products)
    }
  })
}

export const submitIncludeProduct = ({ spuIdList }: { spuIdList: number[] }) => httpClient.post('hqcc/w/includeProduct', { spuIds: spuIdList.join(',') })

export const getSearchSuggestion = (params: { keyword: string }) => httpClient.post('hqcc/r/searchSug', params).then(data => {
  data = data || []
  return convertProductSuggestionListFromServer(data)
})

export const submitModProductSellStatus = ({ idList, sellStatus }: { idList: number[], sellStatus: PRODUCT_SELL_STATUS }) => httpClient.post('hqcc/w/batchSetSaleStatus', {
  spuIds: idList,
  sellStatus: sellStatus
})

export const submitDeleteProduct = ({ idList, isMerchantDelete, isSelectAll, poiIdList } : { idList: number[], isMerchantDelete: boolean, isSelectAll: boolean, poiIdList: number[] }) => httpClient.post('hqcc/w/batchDelete', {
  spuIds: idList,
  isOnlyDeleteMerchant: isMerchantDelete ? 1 : 2,
  isSelectAll: isSelectAll ? 1 : 2,
  wmPoiIds: poiIdList
})

export const submitSaveOrder = (params) => httpClient.post('hqcc/w/saveTagSequence', params)

export const submitSaveOrderWithSync = (params) => httpClient.post('hqcc/w/syncTagSequence', params)

export const getProductRelPoiList = ({ pagination, spuId, filters } : { pagination: Pagination, spuId: number, filters: { poiId?: number, exist: number } }) => httpClient.post('hqcc/r/listRelPoi', {
  pageSize: pagination.pageSize,
  pageNum: pagination.current,
  spuId,
  poiId: defaultTo(filters.poiId, ''),
  exist: filters.exist
}).then(data => {
  data = data || {}
  const { list, totalCount } = data
  const page = {
    ...pagination,
    total: totalCount || 0
  }
  const spu = data.spu || {}
  const product = {
    id: spu.id,
    name: spu.name,
    upcCode: spu.upc,
    skuCode: spu.skuCode,
    picture: spu.pic,
    poiIdList: spu.poiIds || []
  }
  return {
    pagination: page,
    product,
    list: (list || []).map(({ poiId, ...rest }) => ({ id: poiId, ...rest }))
  }
})

export const submitClearRelPoi = ({ poiIdList, spuId } : { poiIdList: number[], spuId: number }) => httpClient.post('hqcc/w/cancelSpuPoiRel', {
  wmPoiIds: poiIdList,
  spuId
})

export const submitPoiProductSellStatus = ({ poiIdList, spuId, sellStatus } : { poiIdList: number[], spuId: number, sellStatus: PRODUCT_SELL_STATUS }) => httpClient.post('hqcc/w/setSpuSaleStatus', {
  wmPoiIds: poiIdList,
  spuId,
  sellStatus
})

export const submitModProductSkuPrice = ({ spuId, poiIdList, skuIdPriceMap, isSelectAll } : { spuId: number, poiIdList: number[], skuIdPriceMap: ({ skuId: number, price: number, isChanged: boolean })[], isSelectAll: boolean }) => {
  return httpClient.post('hqcc/w/updatePrice', {
    spuId,
    wmPoiIds: poiIdList,
    skuPriceVoList: skuIdPriceMap,
    isUpdateAllPoi: isSelectAll
  })
}

export const submitModProductSkuStock = ({ spuId, poiIdList, skuIdStockMap, isSelectAll } : { spuId: number, poiIdList: number[], skuIdStockMap: ({ skuId: number, stock: number, isChanged: boolean })[], isSelectAll: boolean }) => {
  return httpClient.post('hqcc/w/updateStock', {
    spuId,
    wmPoiIds: poiIdList,
    skuStockVoList: skuIdStockMap,
    isUpdateAllPoi: isSelectAll
  })
}

export const submitAddRelPoi = ({ poiIdList, spuId } : { poiIdList: number[], spuId: number }) => httpClient.post('hqcc/w/addSpuPoiRels', {
  spuId,
  poiIds: poiIdList
})
export const getProductDetail = (params) => httpClient.post('hqcc/r/detailProduct', params)
  .then(convertProductDetailWithCategoryAttrFromServer)

export const submitProductInfo = customWrapAkitaBusiness(MODULE.MERCHANT_PRODUCT, (params) => {return params.id ? TYPE.UPDATE : TYPE.CREATE}, true)(
  (params) => httpClient.post('hqcc/w/saveOrUpdateProduct', convertProductToServer(params))
)

export const getSpChangeInfo = (params) => httpClient.get('hqcc/r/getChangeInfo', params).then(convertSpUpdateInfoFromServer)

export const submitDownloadProduct = () => httpClient.post('hqcc/r/addDownload')

export const getDownloadTaskList = () => httpClient.get('hqcc/r/downloadList').then(data => {
  let { list } = (data || {}) as any
  list = list || []
  // 0未生成1生成中2生成成功3生成失败
  return list.map((i) => {
    let status = 1
    if (i.status === 1) {
      status = 0
    }
    let result = 0
    if (i.status === 2) {
      result = 1
    }
    const task: TaskInfo = {
      id: i.id,
      name: i.name,
      time: i.time,
      utime: i.utime,
      ctime: i.ctime,
      status,
      result,
      output: i.url
    }
    return task
  })
})

export const getProductAllRelPoiList = ({ spuId, excludeList, poiIdList } : { spuId: number, excludeList: number[], poiIdList?: number[] }) => httpClient.post('hqcc/r/listAllRelPoi', {
  spuId,
  excludePoiIds: excludeList,
  poiIds: poiIdList || []
}).then(data => {
  const { list } = (data || {}) as any
  return convertPoiListFromServer(list)
})
