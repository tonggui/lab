import httpClient from '@/data/client/instance/merchant'
import { convertMultiCubeProductList } from '../helper/product/multiCube/convertToServer'
import { MultiCubeProduct } from '../interface/product'
import {
  convertMultiCubeProductList as convertMultiCubeProductListFromServer,
  // convertMultiCubeEditProduct as convertMultiCubeEditProductFromServer,
  convertMultiCubeEditProductList as convertMultiCubeEditProductListFromServer
} from '../helper/product/multiCube/convertFromServer'
import { Pagination } from '@/data/interface/common'
import { convertCategoryToTagList } from '@/data/helper/product/multiCube/convertFromServer'
/**
 * 魔方创建任务进度
 * @param taskType
 */
export const apiCubeTaskStatus = () => httpClient.post('/hqcc/cube/r/cubeRunningTask').then((data) => {
  const {
    taskId,
    status,
    runningStatusVo,
    finishStatusVo: processResult,
    submitTime
  } = (data || {}) as any

  const {
    runningStatus,
    mainSpuProcessStatusVo: mainStatus,
    poiAsyncProcessStatusVo: poiStatus
  } = (runningStatusVo || {}) as any

  const {
    finishStatus: resultStatus,
    succeedMainSpuNum: succeedNum,
    failedMainSpuNum: failedNum,
    succeedMainSpuDetails: succeedList,
    failedMainSpuDetails: failedList,
    failedUrl
  } = (processResult || {}) as any

  return {
    taskId,
    status,
    submitTime,
    processStatus: runningStatusVo ? {
      runningStatus,
      mainStatus: {
        succeedNum: mainStatus.finishedNum,
        totalNum: mainStatus.totalNum
      },
      poiStatus: {
        succeedNum: poiStatus.finishedNum,
        totalNum: poiStatus.totalNum
      }
    } : {},
    processResult: processResult ? {
      resultStatus,
      succeedNum,
      failedNum,
      succeedList,
      failedList,
      failedUrl
    } : {}
  }
})

/***
 * 确认魔方创建任务
 * @param taskId
 */
export const apiCubeTaskConfirm = ({ taskId } : { taskId: number }) => httpClient.post('/hqcc/w/cubeRunningTaskConfirm', { taskId })

/**
 * 魔方商品批量创建
 * @param taskId
 */
export const apiCubeBatchSaveProduct = ({
  params
}) => {
  const {
    productList = [],
    syncType = 1,
    excludeSyncContent = []
  } = params
  const products = convertMultiCubeProductList(productList)
  return httpClient.post('/hqcc/cube/w/batchSaveProduct', {
    products,
    syncType,
    excludeSyncContent
  })
}

/**
 * 魔方商品批量创建
 * @param taskId
 */
export const apiCubeSwitch = () => httpClient.post('/hqcc/cube/r/cubeSwitch')

/**
 * 商品上新推荐tabList
 * @param poiId
 */
export const getMultiCubeTabList = ({ cityId, poiId } : { cityId:number, poiId?: number, }) => {
  return httpClient.post('/hqcc/cube/r/tabList', {
    cityId,
    poiId
  }).then(data => {
    data = data['cubeTabInfoVoList'] || []
    return data.map(tab => {
      tab.id = `${tab.id}`;
      return tab
    })
  })
}
/**
 * 获取上新推荐数据店内分类
 */
export const getMultiCubeTagList = ({ cityId, poiId, tabId } : { cityId:number, poiId: number, tabId: number}) => httpClient.post('/hqcc/cube/r/tagList', {
  cityId,
  poiId,
  tabId
}).then(data => {
  const {
    tagList,
    totalProductCount
  } = (data || {}) as any
  return {
    tagList: convertCategoryToTagList(tagList),
    tagInfo: {
      productTotal: totalProductCount || 0
    }
  }
})

/**
 * 商品上新推荐ScopeList
 */
export const getMultiCubeScopeList = () => httpClient.post('hqcc/r/getAllPoiInfo').then(data => {
  return data
})

/**
 * 获取商品上新推荐数据
 */
export const getMultiCubeProductList = ({ cityId, poiId, keyword, pagination, firstTagId, tabId, secondTagId } : { cityId: number, poiId: number, tabId: string, pagination: Pagination, keyword: string, firstTagId: number, secondTagId?: number }) => httpClient.post('hqcc/cube/r/cubeProductList', {
  cityId: cityId,
  poiId,
  firstTagId,
  secondTagId,
  keyword,
  tabId,
  pageNum: pagination.current,
  pageSize: pagination.pageSize
}).then(data => {
  console.log(data)
  const { totalCount, cubeProductList } = (data || {}) as any
  return {
    list: convertMultiCubeProductListFromServer(cubeProductList, tabId),
    pagination: {
      ...pagination,
      total: totalCount
    }
  }
})

/**
 * 创建商品前校验
 * @param wmPoiId 门店id
 * @param productCubeVos 商品创建信息
 * 后端接口参数：
 * wmPoiId: poiId
 * productCubeVos
 */
export const multiCubeCheckProducts = ({ productList }: { productList: MultiCubeProduct[]}) => {
  const list = convertMultiCubeProductList(productList) // TODO
  return httpClient.post('hqcc/cube/w/cubeProductValidate', {
    productCubeVos: JSON.stringify(list)
  }).then(data => {
    data = data || {}
    const { deleteSpuList, editSpuList } = data
    return {
      deletedProductList: convertMultiCubeEditProductListFromServer(deleteSpuList),
      editProductList: convertMultiCubeEditProductListFromServer(editSpuList)
    }
  })
}
