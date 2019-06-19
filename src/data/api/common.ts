import httpClient from '../client/product'
import {
  Pagination
} from '../interface/common'
import {
  convertCityList as convertCityListFromServer,
  convertBrandList as convertBrandListFromServer
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
}).then(data => {
  data = data || []
  data = data.filter(brand => brand && brand.brandId)
  return convertBrandListFromServer(data)
})
// 品牌提报
export const submitApplyBrand = (params: {
  name: string, // 品牌名称
  logoPic: string, // 品牌logo图片
  brandUrl: string // 品牌连接地址
}) => httpClient.post('shangou/w/saveApplyBrand', params, {
  type: 'form',
  timeout: 6000,
})
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
export const uploadImageByFile = (params: { file: File }) => httpClient.post('uploadPicContent/w/uploadImage', params, {
  type: 'form',
  timeout: 6000,
})
/**
 * 搜索图片
 * @param keyword 关键词
 * @param pagination 分页信息
 */
export const getPictureListByName = ({ keyword, pagination }: {
  keyword: string, pagination: Pagination
}) => httpClient.get('food/r/selectPicture', {
  keyWord: keyword,
  pageNum: pagination.current,
  pageSize: pagination.pageSize,
}).then(data => {
  const { list, total } = data.pps
  return {
    list,
    pagination: {
      ...pagination,
      total,
    }
  }
})
/**
 * 获取列表页的开关数据
 * @param poiId
 */
export const getListPageData = (params: { poiId?: number }) => httpClient.post('retail/r/listPageModel', params)
  .then(data => {
    data.hasTransitionProduct = data.hasTransitionProduct === 1
    data.associateSwitch = data.associateSwitch === 1
    data.packetSupport = data.packetSupport === 1
    data.uncompletedStatus = data.uncompletedStatus === 1
    data.monitorTipStatus = data.monitorTipStatus === 1
    return data
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

