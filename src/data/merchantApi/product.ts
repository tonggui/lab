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
  convertTagWithSortList as convertTagWithSortListFromServer
} from '../helper/category/convertFromServer'
import {
  convertProductSuggestionList as convertProductSuggestionListFromServer
} from '../helper/common/convertFromServer'
import {
  convertProductToServer
} from '../helper/product/merchant/convertToServer'

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
    const { pageNum, pageSize, totalCount, products, tags } = data
    return {
      pagination: {
        ...pagination,
        current: pageNum,
        pageSize,
        total: totalCount
      },
      list: convertMerchantProductListFromServer(products),
      tagList: convertTagWithSortListFromServer(tags || [])
    }
  })
}

export const submitIncludeProduct = ({ spuIdList }: { spuIdList: number[] }) => httpClient.post('hqcc/w/includeProduct', { spuIds: spuIdList })

export const getSearchSuggestion = (params: { keyword: string }) => httpClient.get('hqcc/r/searchSug', params).then(data => {
  data = data || {}
  return convertProductSuggestionListFromServer(data.list)
})

export const submitModProductSellStatus = ({ idList, sellStatus }: { idList: number[], sellStatus: PRODUCT_SELL_STATUS }) => httpClient.post('hqcc/w/batchSetSellStatus', {
  spuIds: idList.join(','),
  saleStatus: sellStatus
})

export const submitDeleteProduct = ({ idList }: { idList: number[] }) => httpClient.post('hqcc/w/batchDelete', {
  spuIds: idList
})

export const submitSaveOrder = (params) => httpClient.post('hqcc/w/saveTagSequence', params)

export const submitSaveOrderWithSync = (params) => httpClient.post('hqcc/w/syncTagSequence', params)

export const getProductRelPoiList = ({ pagination, spuId, poiId } : { pagination: Pagination, spuId: number, poiId: number }) => httpClient.get('hqcc/r/listRelPoi', {
  pageSize: pagination.pageSize,
  pageNum: pagination.current,
  spuId,
  wmPoiId: poiId
}).then(data => {
  const { list, totalCount } = (data || {}) as any
  const page = {
    ...pagination,
    total: totalCount
  }
  const spu = data.spu || {}
  const product = {
    id: spu.id,
    name: spu.name,
    upcCode: spu.upc,
    skuCode: spu.skuCode,
    picture: spu.pic,
    poiIdList: data.poiIds || []
  }
  return {
    pagination: page,
    product,
    list: list || []
  }
})

export const submitClearRelPoi = ({ poiId, spuId } : { poiId: number, spuId: number }) => httpClient.post('hqcc/w/cancelSpuPoiRel', {
  poiId,
  spuId
})

export const submitPoiProductSellStatus = ({ poiId, spuId, sellStatus } : { poiId: number, spuId: number, sellStatus: PRODUCT_SELL_STATUS }) => httpClient.post('hqcc/w/setSpuSaleStatus', {
  poiId,
  spuId,
  sellStatus
})

export const submitAddRelPoi = ({ poiIdList, spuId } : { poiIdList: number[], spuId: number }) => httpClient.post('hqcc/w/addSpuPoiRels', {
  spuId,
  poiIds: poiIdList
})
export const getProductDetail = (params) => httpClient.post('hqcc/r/detailProduct', params)
  .then(convertProductDetailWithCategoryAttrFromServer)

export const submitProductInfo = (params) => httpClient.post('hqcc/w/saveOrUpdateProduct', convertProductToServer(params))

export const getSpChangeInfo = (params) => httpClient.get('hqcc/r/getChangeInfo', params)

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
      status,
      result,
      url: i.url
    }
    return task
  })
})
