import httpClient from '../client/instance/medicine'
import httpClientProduct from '../client/instance/product'
import {
  MedicineMultiStoreSearchParams
} from '../interface/product'

/**
 * 医药多门店管理——筛选条件——获取城市列表
 */
export const getCityList = async () => httpClient.get('/city/list')
/**
 * 医药多门店管理——根据条件分页查询接口
 */
export const multiStoreQueryList = async (params:MedicineMultiStoreSearchParams) => {
  return httpClient.post('/query/result', {
    ...params
  })
}
// 查询页面筛选条件接口
export const multiStoreGetCondition = async () => {
  // console.log(params)
  return httpClient.post('/query/condition')
}
/**
 * 医药多门店管理——删除商品
 */
export const multiStoreProductDelete = async (params:MedicineMultiStoreSearchParams) => {
  return httpClient.post('/modify/delete', {
    ...params
  })
}
/**
 * 医药多门店管理——修改商品上下架状态
 */
export const multiStoreProductModifyShelf = async (params:MedicineMultiStoreSearchParams) => {
  return httpClient.post('/modify/shelf', {
    ...params
  })
}
/**
 * 医药多门店管理——批量调价
 */
export const multiStoreProductModifyPrice = async (params) => {
  console.log({ ...params })
  const { targetPrice } = params
  return httpClient.post('/modify/price/save', {
    ...params,
    targetPrice: targetPrice
  })
}
/**
 * 医药多门店管理——批量修改库存
 */
export const multiStoreProductModifyStock = async (params:MedicineMultiStoreSearchParams) => {
  return httpClient.post('/modify/stock/save', {
    ...params
  })
}
/**
 * 根据查询导出
 */
export const multiStoreExportExcel = async (params:MedicineMultiStoreSearchParams, chooseAll) => {
  // console.log(params)
  return httpClient.post('/export', {
    ...params,
    chooseAll
  })
}
/**
 * 单个商品删除
 */
export const fetchSubmitDeleteProduct = async (params) => {
  // console.log(params)
  return httpClientProduct.post('/food/w/batchDelete', {
    ...params
  })
}
/**
 * 单个商品上下架
 */
export const fetchSubmitModProduct = async (params) => {
  // console.log(params)
  return httpClientProduct.post('/retail/w/batchSetSellStatus', {
    ...params
  })
}
/**
 * 单个商品修改价格/库存
 */
export const fetchSubmitModProductSku = async (params, type) => {
  // console.log(params)
  if (type === 'price') {
    return httpClientProduct.post('/retail/w/updatePrice', {
      ...params
    })
  } else if (type === 'stock') {
    return httpClientProduct.post('/retail/w/batchUpdateSkuStock', {
      ...params
    })
  }
}
