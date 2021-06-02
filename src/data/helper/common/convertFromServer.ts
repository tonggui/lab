import { defaultTo } from 'lodash'
import moment from 'moment'
import { City, Brand, Tip, Suggestion, TaskInfo, TimeZone } from '../../interface/common'
import { LimitSale } from '../../interface/product'
import { PoiTag } from '../../interface/poi'
import { formatTime, trimSplit, parseJsonString } from '@/common/utils'
import { SUGGESTION_TYPE } from '@/data/enums/common'
import { defaultWhiteListModuleMap } from '@/data/constants/common'

const prepareDate = (dateStr, distanceFromToday = 0) => {
  if (dateStr && dateStr.length >= 8) {
    return dateStr.substr(0, 4) + '-' + dateStr.substr(4, 2) + '-' + dateStr.substr(6, 2)
  }
  return moment().add(distanceFromToday, 'd').format('YYYY-MM-DD')
}

export const convertLimitSale = (limitSale: string): LimitSale => {
  const _limitSale = parseJsonString(limitSale, {})
  const status = +_limitSale.limitSale || 0
  return {
    status,
    multiPoi: +_limitSale.multiPoi || 0,
    range: [prepareDate(status ? _limitSale.begin : ''), prepareDate(status ? _limitSale.end : '', 29)], // 默认持续30天
    rule: status ? (_limitSale.type === 2 ? -1 : (_limitSale.frequency || 1)) : 1, // type为2代表整个周期，转换为rule就是-1
    max: status ? (_limitSale.count || 0) : 0
  }
}

export const convertCity = (city: any): City => {
  const { cityId, cityName, cityPinyin } = city
  const node: City = {
    id: cityId,
    name: cityName || '',
    spell: cityPinyin || ''
  }
  return node
}

export const convertCityList = (list: any[]): City[] => {
  list = list || []
  return list.map(convertCity)
}

export const convertBrand = (brand: any): Brand => {
  const node: Brand = {
    id: brand.spBrandId,
    name: brand.name,
    type: brand.brandSourceType,
    spBrandId: -1 // 废弃无效字段
  }
  return node
}

export const convertBrandList = (list: any[]): Brand[] => {
  list = list || []
  return list.map(convertBrand)
}

export const convertTip = (tip: any, index?): Tip => {
  const node: Tip = {
    operationText: tip.link ? '去查看' : '',
    closable: true,
    id: `MESSAGE_${index || ''}`,
    content: tip.content,
    link: tip.link,
    sequence: tip.sequence
  }
  return node
}

export const convertTipList = (list: any[]): Tip[] => {
  list = list || []
  return list.map(convertTip)
}

export const convertProductSuggestion = (data: any): Suggestion => {
  data = data || {}
  const { id, name, tagId, tagPath, dataType } = data as any
  const node: Suggestion = {
    id,
    // TODO 如果是品牌，sug里面的id是品牌id；如果是商品，则是商品id
    brandId: dataType === SUGGESTION_TYPE.BRAND ? id : '',
    name: name || '',
    tagId: Number(tagId || 0),
    tagPath: trimSplit(tagPath),
    type: dataType
  }
  return node
}

export const convertProductSuggestionList = (list: any[]): Suggestion[] => {
  list = list || []
  return list.map(convertProductSuggestion)
}

/**
 * 商品管理处理进度的任务列表节点清洗
 * @param node
 * @returns {TaskInfo}
 */
export const convertTask = (node: any): TaskInfo => {
  const task: TaskInfo = {
    id: node.id,
    name: node.name,
    time: formatTime(node.time || node.ctime),
    utime: node.utime,
    ctime: node.ctime,
    type: node.taskType || node.type,
    status: node.statusType || node.status,
    result: node.result,
    output: node.output,
    outputListUrl: node.outputListUrl,
    statusParam1: node.statusParam1,
    statusParam2: node.statusParam2,
    extraLink: node.resultUrl,
    contentLink: node.contentUrl,
    detailLink: node.detailUrl,
    poiExcelUrl: node.poiExcelUrl,
    productExcelUrl: node.productExcelUrl,
    poiCount: node.poiCount,
    productCount: node.productCount,
    subType: node.subType,
    subTypeDesc: node.subTypeDesc,
    tagList: node.tagList,
    poiSelectType: node.poiSelectType
  }
  return task
}

// TODO convertTaskList
export const convertTaskList = (list: any[]): TaskInfo[] => {
  list = list || []
  return list.map(convertTask)
}

/**
 * 商家商品中心的处理进度的任务列表节点清洗
 * @param {any[]} list
 * @returns {TaskInfo[]}
 */
// export const convertMerchantTask = (node: any): TaskInfo => {
//   const task: TaskInfo = {
//     id: node.id,
//     name: node.name,
//     time: formatTime(node.time),
//     status: node.statusType,
//     statusParam1: node.statusParam1,
//     statusParam2: node.statusParam2
//   }
//   return task
// }

// export const convertMerchantTaskList = (list: any[]): TaskInfo[] => {
//   list = list || []
//   return list.map(convertMerchantTask)
// }

export const convertPoiTag = (poiTag): PoiTag => ({
  ...poiTag,
  isPrimary: poiTag.isPrimary === 1
})

export const convertCommonPageModel = (pageModel: any): {
  isB: boolean,
  prefix: string,
  poiId: number,
  virtualPoiTags: PoiTag[],
  poiTags: PoiTag[],
  pageGrayInfo: Map<string, boolean>
} => {
  return {
    isB: pageModel.isB === 1,
    prefix: pageModel.prefix,
    poiId: pageModel.wmPoiId,
    virtualPoiTags: pageModel.poiTag || [],
    poiTags: (pageModel.realPoiTag || []).map(convertPoiTag),
    pageGrayInfo: pageModel.gray || {}
  }
}

/**
 * 清洗时间区域
 * @param obj
 */
export const convertTimeZone = (obj: object) => {
  const days: number[] = []
  let timeList = []
  Object.entries(obj).forEach(([key, value]) => {
    days.push(Number(key) - 1)
    timeList = (value || []).map(v => ({
      start: v.start,
      end: v.end,
      time: `${v.start}-${v.end}`
    }))
  })
  const node: TimeZone = {
    days,
    timeList
  }
  return node
}

export const convertWhiteListModuleMap = (map: object) => {
  return Object.entries(defaultWhiteListModuleMap).reduce((prev, [key, value]) => {
    prev[key] = defaultTo(map[key], value)
    return prev
  }, {})
}
