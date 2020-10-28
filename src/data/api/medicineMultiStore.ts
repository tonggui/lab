import httpClient from '../client/instance/product'
import {
  MedicineMultiStoreSearchParams,
  MedicineMultiStoreOptionsParams
} from '../interface/product'

/**
 * 医药多门店管理——根据条件分页查询接口
 */
export const multiStoreQueryList = async (params:MedicineMultiStoreSearchParams) => {
  return httpClient.post('/medicine/query/result', {
    ...params
  })
}
// 查询页面筛选条件接口
export const getCondition = async () => {
  // console.log(params)
  return httpClient.post('/medicine/query/result/condition')
}
/**
 * 医药多门店管理——删除商品
 */
export const multiStoreProductDelete = async (params:MedicineMultiStoreSearchParams) => {
  return httpClient.post('/medicine/modify/delete', {
    ...params
  })
}
/**
 * 医药多门店管理——修改商品上下架状态
 */
export const multiStoreProductModifyShelf = async (params:MedicineMultiStoreSearchParams) => {
  return httpClient.post('/medicine/modify/shelf', {
    ...params
  })
}
/**
 * 医药多门店管理——批量调价
 */
export const multiStoreProductModifyPrice = async (params:MedicineMultiStoreSearchParams) => {
  return httpClient.post('/medicine/modify/price/save', {
    ...params
  })
}
/**
 * 医药多门店管理——批量修改库存
 */
export const multiStoreProductModifyStock = async (params:MedicineMultiStoreSearchParams) => {
  return httpClient.post('/medicine/modify/stock/save', {
    ...params
  })
}
// 根据条件导出接口
export const exportExcel = async (params:MedicineMultiStoreSearchParams, optionsParams:MedicineMultiStoreOptionsParams) => {
  // console.log(params)
  return httpClient.post('/medicine/export', {
    ...params,
    ...optionsParams
  })
}
// 删除单个商品
export const fetchSubmitDeleteProduct = async (params) => {
  console.log(params)
  return httpClient.post('/food/w/batchDelete', {
    ...params
  })
}
