import {
  apiCubeTaskStatus,
  apiCubeTaskConfirm,
  apiCubeBatchSaveProduct,
  apiCubeSwitch,
  getMultiCubeTabList,
  getMultiCubeScopeList,
  getMultiCubeProductList,
  multiCubeCheckProducts, getMultiCubeTagList
} from '@/data/merchantApi/cube'
import { Pagination } from '@/data/interface/common'
import { MultiCubeProduct } from '@/data/interface/product'
import { submitSingleCreateNewArrivalProduct } from '@/data/api/product'
export const getCubeTaskStatus = () => apiCubeTaskStatus()

export const getCubeTaskConfirm = (taskId) => apiCubeTaskConfirm({ taskId })

export const getCubeBatchSaveProduct = (params) => apiCubeBatchSaveProduct({
  params
})

export const getCubeSwitch = () => apiCubeSwitch()
/**
 * 门店ScopeList列表
 * @param poiId
 */
export const fetchGetPoiScopeList = () => getMultiCubeScopeList()

/**
 * 获取商品推荐类目
 * @param keyword
 * @param poiId
 */
export const fetchGetMultiCubeTagList = ({ tabId, cityId, poiId } : { tabId: number, cityId:number, poiId: number}) => getMultiCubeTagList({ tabId, cityId, poiId })

/**
 * 商品上新tab列表
 * @param poiId
 */
export const fetchGetProductMultiCubeTabList = (params) => getMultiCubeTabList(params)

// 获取推荐商品列表（多店魔方）
export const fetchGetMultiRecommendProductList =
  (pagination: Pagination, { keyword, firstTagId, tabId, secondTagId } :
    { tabId: string, keyword: string, firstTagId: number, secondTagId?: number }, cityId: number, poiId: number) => getMultiCubeProductList({
    cityId, poiId, keyword, pagination, firstTagId, tabId, secondTagId
  })

export const fetchSubmitMultiCreateRecommendProduct = (product: MultiCubeProduct, extra, poiId) => submitSingleCreateNewArrivalProduct({
  product,
  extra,
  poiId
})

// 创建商品前校验
export const fetchMultiCubeCheckProducts = (productList: MultiCubeProduct[]) => multiCubeCheckProducts({ productList })
