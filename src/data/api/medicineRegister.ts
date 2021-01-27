import httpClient from '../client/instance/medicineRegister'
import {
  MedicineRegisterSearchParams,
  MedicineRegisterInfo,
  MedicineRegisterInfoModify
} from '../interface/product'

/**
 * 疫情药品登记——筛选条件——获取城市列表
 */
export const getCityList = async () => httpClient.get('/citys')
/**
 * 疫情药品登记——根据条件分页查询接口
 */
export const getQueryList = async (params: MedicineRegisterSearchParams) => {
  return httpClient.post('/list', params)
}
/**
 * 疫情药品登记——清除配置
 */
export const registerDelete = async (params) => {
  return httpClient.post('/delete', params)
}
/**
 * 疫情药品登记-根据查询导出
 */
export const registerExportExcel = async (params: MedicineRegisterSearchParams, chooseAll) => {
  return httpClient.post('/download', { ...params, chooseAll })
}
/**
 * 疫情药品登记-新增配置
 */
export const registerAdd = async (params: MedicineRegisterInfo) => {
  return httpClient.post('/add', { ...params })
}
/**
 * 疫情药品登记-修改配置
 */
export const registerUpdate = async (params: MedicineRegisterInfoModify) => {
  return httpClient.post('/update', { ...params })
}
/**
 * 疫情药品登记-excel模板
 */
export const registerExcelTemplate = () => httpClient.post('/excelTemplate/download')
/**
 * 疫情药品登记-excel批量设置
 */
export const registerExcelUpload = async (params: {file: File}) => {
  return httpClient.post('/upload', { ...params })
}
