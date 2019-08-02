import { City, Brand, Tip, Suggestion, TaskInfo } from '../../interface/common'
import { PoiTag } from '../../interface/poi'
import { formatTime, trimSplit } from '@/common/utils'

export const convertCity = (city: any): City => {
  const { cityId, cityName, cityPinyin } = city
  const node: City = {
    id: cityId,
    name: cityName || '',
    spell: cityPinyin || '',
  }
  return node
}

export const convertCityList = (list: any[]): City[] => {
  list = list || []
  return list.map(convertCity)
}

export const convertBrand = (brand: any): Brand => {
  const node: Brand = {
    id: brand.brandId,
    name: brand.name,
    type: brand.brandSourceType,
    spBrandId: brand.spBrandId,
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
    name: name || '',
    tagId: Number(tagId || 0),
    tagPath: trimSplit(tagPath),
    type: dataType
  };
  return node
}

export const convertProductSuggestionList = (list: any[]): Suggestion[] => {
  list = list || [];
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
    time: formatTime(node.ctime),
    type: node.type,
    status: node.status,
    result: node.result
  }
  return task
}

// TODO convertTaskList
export const convertTaskList = (list: any[]): TaskInfo[] => {
  list = list || [];
  return list.map(convertTask)
}

/**
 * 商家商品中心的处理进度的任务列表节点清洗
 * @param {any[]} list
 * @returns {TaskInfo[]}
 */
export const convertMerchantTask = (node: any): TaskInfo => {
  const task: TaskInfo = {
    id: node.id,
    name: node.name,
    time: formatTime(node.time),
    status: node.statusType,
    statusParam1: node.statusParam1,
    statusParam2: node.statusParam2
  }
  return task
}

export const convertMerchantTaskList = (list: any[]): TaskInfo[] => {
  list = list || []
  return list.map(convertMerchantTask)
}

export const convertPoiTag = (poiTag): PoiTag => ({
  ...poiTag,
  isPrimary: poiTag.isPrimary === 1,
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
