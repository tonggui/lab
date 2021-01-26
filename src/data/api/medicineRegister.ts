import httpClient from '../client/instance/medicine'
import {
  MedicineRegisterSearchParams
} from '../interface/product'

/**
 * 疫情药品登记——筛选条件——获取城市列表
 */
export const getCityList = async () => httpClient.get('/city/list')
/**
 * 疫情药品登记——根据条件分页查询接口
 */
export const getQueryList = async (params: MedicineRegisterSearchParams) => {
  return httpClient.post('/medicineSaleRule/list', { ...params })
}
/**
 * 疫情药品登记——清除单条配置
 */
export const registerDelete = async (params) => {
  return httpClient.post('/modify/delete', { ...params })
}
/**
 * 疫情药品登记——批量清除配置
 */
export const multiRegisterDelete = async (params) => {
  return httpClient.post('/food/w/batchDelete', { ...params })
}
/**
 * 疫情药品登记-根据查询导出
 */
export const registerExportExcel = async (params: MedicineRegisterSearchParams, chooseAll) => {
  return httpClient.post('/export', { ...params, chooseAll })
}
/**
 * 疫情药品登记-更新单条配置
 */
export const registerUpdate = async (params) => {
  return httpClient.post('shangou/medicine/audit/w/saveAuditSp', { ...params })
}
/**
 * 疫情药品登记-批量更新配置
 */
export const multiRegisterUpdate = async (params) => {
  return httpClient.post('shangou/medicine/audit/w/saveAuditSp', { ...params })
}
