import httpClient from '../client/instance/product'
import {
  Pagination
} from '../interface/common'
import {
  convertCityList as convertCityListFromServer,
  convertBrandList as convertBrandListFromServer,
  convertCommonPageModel as convertCommonPageModelFromServer
} from '../helper/common/convertFromServer'

/**
 * 通用接口
 * 获取全国城市信息列表
 */
export const getCityList = () => httpClient.post('uicomponent/r/cities')
  .then(convertCityListFromServer)
/**
 * 根据关键字搜索品牌
 * @param keyword
 */
export const getBrandByName = ({ keyword }: { keyword: string }) => httpClient.post('retail/r/spBrandSug', {
  keyword
}).then(({ list }) => {
  list = list || []
  list = list.filter(brand => brand && brand.brandId)
  return convertBrandListFromServer(list)
})
// 品牌提报
export const submitApplyBrand = (params: {
  wmPoiId: number|string, // 门店id
  name: string, // 品牌名称
  logoPic: string, // 品牌logo图片
  brandUrl: string // 品牌连接地址
}) => httpClient.upload('shangou/w/saveApplyBrand', params)
/**
 * 根据base64形式上传图片
 * @param base64 图片base64格式
 * @param fileName 图片名称
 * @param poiIds 相关的门店ids
 * @param score 是否打分
 */
export const uploadImageByBase64 = ({ base64, name, poiId, score }: {
  base64: string, // 文件base64格式
  name: string, // 文件名称
  poiId?: number[], // 门店id列表
  score?: number // 图片评分
}) => httpClient.post('uploadTool/w/uploadImg', {
  multipart: base64,
  picName: name,
  poiIds: poiId,
  picAudit: score
})

// TODO
/**
 * 根据file类型上传图片
 * @param file 图片file
 */
export const uploadImageByFile = (params: { file: File }) => httpClient.upload('uploadPicContent/w/uploadImage', params)

/**
 * 搜索图片
 * @param keyword 关键词
 * @param pagination 分页信息
 */
export const getPictureListByName = ({ keyword, pagination, wmPoiId }: {
  keyword: string, pagination: Pagination, wmPoiId?: number | string
}) => httpClient.get('food/r/selectPicture', {
  wmPoiId,
  keyWord: keyword,
  pageNum: pagination.current,
  pageSize: pagination.pageSize
}).then(data => {
  const { list, total, pageNum, pageSize } = data.pps
  return {
    list,
    pagination: {
      ...pagination,
      total,
      current: pageNum,
      pageSize
    }
  }
})
// TODO
/**
 * TODO 此接口是查询批量同步任务进度
 * 获取任务的进度
 * @param taskId 任务id
 */
export const getTaskProgress = (params: { taskId: number }) => httpClient.get('retail/sync/task/r/progress', params).then(data => {
  data = data || {}
  return data.data || []
})
/**
 * TODO: 现在所有的批量excel模版都配置在这个接口中
 * !!后期会根据不同品类采用不同模版!!
 * 获取excel模版文件地址
 */
export const getExcelTemplateMap = () => httpClient.get('retail/batch/r/excelTpl')
  .then(data => data || {})

/**
 * 完全前后端分离后通用页面数据获取接口
 */
export const getPageEnvInfo = ({ poiId } : { poiId: number }) =>  httpClient.post('/retail/r/indexPageModel', { wmPoiId: poiId })
  .then(convertCommonPageModelFromServer)

/**
 * 完全前后端分离后监控页面数据获取接口
 */
export const getMonitorPageInfo = ({ poiId } : { poiId: number }) => httpClient.post('/retail/r/getMonitorInfo', { wmPoiId: poiId })

/**
 * 获取页面评价
 * @param params { pageType }
 */
export const getEvaluation = (params: { pageType: number }) => httpClient.get('feedback/r/getFeedbackRecord', params)
/**
 * 提交页面评价
 * @param params { pageType, likeType }
 */
export const submitEvaluation = (params: { pageType: number, likeType: number }) => httpClient.post('feedback/w/likePage', { pageVersion: 1, ...params })
