import httpClient from '../client/instance/product'
// import defaultTo from 'lodash/defaultTo'
// import {
//   Pagination
// } from '../interface/common'
import {
  MedicineMultiStoreSearchParams
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
export const getCondition = async () => {
  // console.log(params)
  return httpClient.post('/medicine/query/result/condition')
}
