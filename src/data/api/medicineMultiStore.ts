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
// 查询页面筛选条件接口
export const multiStoreGetCondition = async () => {
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
export const multiStoreProductModifyPrice = async (params) => {
  console.log({ ...params })
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
/**
 * 根据查询导出
 */
export const multiStoreExportExcel = async (params:MedicineMultiStoreSearchParams, chooseAll) => {
  // console.log(params)
  return httpClient.post('/medicine/export', {
    ...params,
    chooseAll
  })
}
/**
 * 单个商品删除
 */
export const fetchSubmitDeleteProduct = async (params) => {
  // console.log(params)
  return httpClient.post('/food/w/batchDelete', {
    ...params
  })
}
/**
 * 单个商品上下架
 */
export const fetchSubmitModProduct = async (params) => {
  // console.log(params)
  return httpClient.post('/retail/w/batchSetSellStatus', {
    ...params
  })
}
/**
 * 单个商品修改价格/库存
 */
export const fetchSubmitModProductSku = async (params, type) => {
  // console.log(params)
  if (type === 'price') {
    return httpClient.post('/retail/w/updatePrice', {
      ...params
    })
  } else if (type === 'stock') {
    return httpClient.post('/retail/w/batchUpdateSkuStock', {
      ...params
    })
  }
}
