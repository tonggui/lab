import httpClient from '../client/instance/product'
import {
  MedicineMultiStoreSearchParams
} from '../interface/product'

/**
 * 医药多门店管理——根据条件分页查询接口
 */
export const multiStoreQueryList = async (params:MedicineMultiStoreSearchParams) => {
  return httpClient.post('/medicine/query/result', {
    ...params
  })
}
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
