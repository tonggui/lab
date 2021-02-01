import { trim } from 'lodash'
import httpClient from '../client/instance/medicineRegister'
import {
  MedicineRegisterSearchParams,
  MedicineRegisterInfo,
  MedicineRegisterInfoModify
} from '../interface/product'

const convertMedicineRegisterQuery = (data: MedicineRegisterSearchParams) => {
  const { cityId = [], purchaseType, matchingRules, productInfo, ...rest } = data
  return {
    cityId: cityId.join(','),
    purchaseType: purchaseType === -1 ? '' : purchaseType,
    matchingRules: matchingRules === -1 ? '' : matchingRules,
    productInfo: trim(productInfo),
    ...rest
  }
}

/**
 * 疫情药品登记——筛选条件——获取城市列表
 */
export const getCityList = async () => httpClient.get('/citys')
/**
 * 疫情药品登记——根据条件分页查询接口
 */
export const getQueryList = async (params: MedicineRegisterSearchParams) => {
  const query = convertMedicineRegisterQuery(params)
  return httpClient.post('/list', query)
}
/**
 * 疫情药品登记——删除配置
 */
export const registerDelete = async (params) => {
  return httpClient.post('/delete', params)
}
/**
 * 疫情药品登记-根据查询导出
 */
export const registerExportExcel = async (params: MedicineRegisterSearchParams, chooseAll) => {
  const query = convertMedicineRegisterQuery(params)
  return httpClient.post('/download', { ...query, chooseAll })
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
  return httpClient.upload('/upload', { ...params })
}
/**
 * 获取门店的签署协议信息
 */
export const getAgreementInfo = () => httpClient.post('/getAgreementConfirmation').then(data => {
  const {
    agreementUrl,
    signed,
    signRequired,
    supermarketChain,
    ...others
  } = data
  return {
    ...others,
    url: agreementUrl,
    isMultiple: supermarketChain,
    signed,
    required: signRequired
  }
})
/**
 * 提交门店签署协议确认
 */
export const submitAgreement = () => httpClient.post('/submitAgreement')
