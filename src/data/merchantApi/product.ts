import httpClient from '../client/instance/merchant'
import {
  convertMerchantProductList as convertMerchantProductListFromServer
} from '../helper/product/merchant/convertFromServer'
import {
  convertTagWithSortList as convertTagWithSortListFromServer,
} from '../helper/category/convertFromServer'
import {
  convertProductSuggestionList as convertProductSuggestionListFromServer
} from '../helper/common/convertFromServer'

export const getProductList = (params) => {
  const { pagination, keyword, tagId, includeStatus, needTags } = params
  return httpClient.post('/hqcc/r/listProduct', {
    keyWords: keyword || '',
    tagId,
    includeStatus,
    needTags: needTags,
    brandId: 0,
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

export const submitIncludeProduct = ({ spuIdList } : { spuIdList: number[] }) => httpClient.post('/hqcc/w/includeProduct', { spuIds: spuIdList })

export const getSearchSuggestion = (params: { keyword: string }) => httpClient.get('/hqcc/r/searchSug', params).then(data => {
  data = data || {}
  return convertProductSuggestionListFromServer(data.list)
})
