import httpClient from '../client/instance/medicine'
import {
  MedicineRegisterSearchParams
} from '../interface/product'

/**
 * 疫情药品登记——筛选条件——获取城市列表
 */
export const getCityList = async () => httpClient.get('city/list')
/**
 * 疫情药品登记——根据条件分页查询接口
 */
export const getQueryList = async (params: MedicineRegisterSearchParams) => {
  return httpClient.post('medicineSaleRule/list', params)
}
/**
 * 疫情药品登记——清除配置
 */
export const registerDelete = async (params) => {
  return httpClient.post('medicineSaleRule/delete', params)
}
/**
 * 疫情药品登记-根据查询导出
 */
export const registerExportExcel = async (params: MedicineRegisterSearchParams, chooseAll) => {
  return httpClient.post('medicineSaleRule/download', { ...params, chooseAll })
}
/**
 * 疫情药品登记-更新配置
 */
export const registerUpdate = async (params) => {
  return httpClient.post('/health/pc/medicineSaleRule/update', { ...params })
}
/**
 * 疫情药品登记-新增配置
 */
export const registerAdd = async (params) => {
  return httpClient.post('/health/pc/medicineSaleRule/add', { ...params })
}
