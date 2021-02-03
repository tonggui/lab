import { trim } from 'lodash'
import { stringify } from 'querystring'
import httpClient from '../client/instance/medicineRegister'

import {
  Pagination
} from '@/data/interface/common'
import { formatTime } from '@/common/utils'

import {
  MedicineRegisterSearchParams,
  MedicineRegisterInfo,
  MedicineRegisterInfoModify
} from '../interface/product'

const convertMedicineRegisterQuery = (data: MedicineRegisterSearchParams) => {
  const { cityIds = [], purchaseType, matchingRules, productInfo, ...rest } = data
  return {
    cityIds: cityIds.join(','),
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
export const registerExportExcel = async (params: MedicineRegisterSearchParams) => {
  const query = convertMedicineRegisterQuery(params)
  window.open('/health/pc/medicineSaleRule/download?' + stringify(query))
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
export const registerExcelTemplate = () => httpClient.get('/template/download').then(data => {
  return [{
    link: data.url,
    time: data.time
  }]
})
/**
 * 疫情药品登记-excel批量设置
 */
export const registerExcelUpload = async (params: {file: File}) => {
  return httpClient.upload('/upload', { ...params })
}
/**
 * 获取门店的签署协议信息
 */
export const getAgreementInfo = () => httpClient.get('/contract/query').then(data => {
  const {
    agreementUrl,
    signed,
    signRequired,
    supermarketChain
  } = data
  return {
    url: agreementUrl,
    isMultiple: supermarketChain,
    signed,
    required: signRequired
  }
})
/**
 * 提交门店签署协议确认
 */
export const submitAgreement = () => httpClient.post('/contract/confirm')

/**
 * 获取批量导入任务进度列表
 */
export const fetchTaskList = ({ pagination } : { pagination: Pagination }) => httpClient.get('/task/list', {
  pageSize: pagination.pageSize,
  pageNum: pagination.current
}).then(data => {
  data = data || {}
  return {
    pagination: {
      ...pagination,
      total: data.totalCount
    },
    list: (data.list || []).map(item => {
      let { taskName, createTime, taskStatus, ruleUrl, failReasonUrl, ...rest } = item
      taskStatus = failReasonUrl ? 2 : taskStatus
      return {
        ...rest,
        name: taskName,
        time: formatTime(createTime),
        status: taskStatus,
        contentLink: ruleUrl,
        extraLink: failReasonUrl
      }
    })
  }
})
/**
 * 疫情药品登记-购买信息下载
 */
export const getInfoDownload = () => httpClient.get('/info/download').then(data => data)
