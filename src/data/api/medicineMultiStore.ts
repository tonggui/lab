import httpClient from '../client/instance/product'
// import defaultTo from 'lodash/defaultTo'
// import {
//   Pagination
// } from '../interface/common'
import {
  MedicineMultiStoreSearchParams,
  MedicineMultiStoreOptionsParams
} from '../interface/product'

/**
 * 医药多门店管理——根据条件分页查询接口
 * @returns {所有店内分类}
 */
export const multiStoreQueryList = async (params:MedicineMultiStoreSearchParams) => {
  // console.log(params)
  return httpClient.post('/medicine/query/result', {
    ...params
  })
}
// 查询页面筛选条件接口
export const getCondition = async () => {
  // console.log(params)
  return httpClient.post('/medicine/query/result/condition')
}
// 根据条件导出接口
export const exportExcel = async (params:MedicineMultiStoreSearchParams, optionsParams:MedicineMultiStoreOptionsParams) => {
  // console.log(params)
  return httpClient.post('/medicine/export', {
    ...params,
    ...optionsParams
  })
}
