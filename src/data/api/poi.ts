import httpClient from '../client/instance/product'
import isNil from 'lodash/isNil'
import {
  AuditInfo
} from '../interface/poi'
import {
  Pagination
} from '../interface/common'
import {
  WHITELIST_FIELDS_MAP
} from '../enums/fields'
import {
  defaultAutoClearStockConfig
} from '../constants/poi'
import {
  convertTipList as convertTipListFromServer,
  convertWhiteListModuleMap as convertWhiteListModuleMapFromServer
} from '../helper/common/convertFromServer'
import {
  convertPoiList as convertPoiListFromServer,
  convertPoi as convertPoiFromServer,
  convertAuditStatistics as convertAuditStatisticsFromServer
} from '../helper/poi/convertFromServer'
import { getMerchantId } from '@/common/constants'

/**
 * 获取门店类型
 * @param poiId 门店id
 */
export const getPoiType = ({ poiId }: { poiId: number }) => httpClient.post('retail/r/marketTagInfo', {
  wmPoiId: poiId
})
/**
 * 获取门店mcc消息
 * @param poiId 门店id
 */
export const getPoiTipList = ({ poiId }: { poiId: number }) => httpClient.post('retail/r/poiCategory/info', {
  wmPoiId: poiId
}).then(convertTipListFromServer)
/**
 * 获取门店审核信息
 * @param poiId 门店id
 */
export const getPoiAuditInfo = ({ poiId }: { poiId: number }) => httpClient.post('shangou/cube/r/poiStatusInfo', {
  wmPoiId: poiId
}).then(data => {
  data = data || {}
  return ({
    status: data.auditStatus,
    businessDays: data.bizDays,
    onlineDayLimit: data.onlineDayLimit || 0,
    categoryMatch: !!data.categoryMatch,
    title: data.title,
    description: data.content,
    rejectReason: data.rejectReason || '',
    processStatus: data.processStatus
  }) as AuditInfo
})
/**
 * 门店提交审核
 * @param poiId 门店id
 */
export const submitPoiAudit = ({ poiId }: { poiId: number }) => httpClient.post('food/w/createTask', {
  wmPoiId: poiId
})
/**
 * 门店是否命中风控
 * @param poiId 门店id
 */
export const getPoiRiskControl = ({ poiId }: { poiId: number }) => httpClient.post('food/r/hasRiskStopSellProducts', {
  wmPoiId: poiId
}).then(data => data === 1)
/**
 * 获取门店的签署协议信息
 * @param poiId
 * @return {*}
 */
export const getPoiAgreementInfo = ({ poiId }: { poiId: number }) => httpClient.post('retail/r/getProductAgreementConfirmation', {
  wmPoiId: poiId
}).then(data => {
  const {
    agreementUrl,
    signed,
    supermarketChain,
    signRequired,
    ...others
  } = data
  return {
    ...others,
    url: agreementUrl,
    signed,
    isMultiple: supermarketChain,
    required: signRequired
  }
})
/**
 * 提交门店签署协议确认
 * @param poiId
 * @return {*}
 */
export const submitPoiAgreement = ({ poiId }: { poiId: number }) => httpClient.post('retail/w/submitAgreement', {
  wmPoiId: poiId
})
/**
 * 获取列表页的开关数据
 * @param poiId
 */
export const getListPageData = ({ poiId }: { poiId?: number }) => httpClient.post('retail/r/listPageModel', { wmPoiId: poiId })
  .then(data => ({
    hasTransitionProduct: data.hasTransitionProduct === 1,
    hasPackageBag: data.packetSupport === 1,
    errorProductCount: data.errorProductCount || 0,
    unRelationProductCount: data.unRelationProductCount || 0,
    categoryTemplateGray: !!data.categoryTemplateGray,
    maxFirstTagConfig: data.maxFirstTagConfig || {},
    categoryTemplateTaskId: data.taskId,
    categoryTemplatePollingTime: data.sleep
  }))
/**
 * 获取门店列表
 * @param routerTagId 品类id
 * @param keyword 关键词
 * @param pagination 分页信息
 */
export const getPoiList = ({ routerTagId, keyword, cityId, pagination }: {
  routerTagId: number,
  keyword: string,
  cityId: number,
  pagination: Pagination
}) => httpClient.post('sync_food/async/r/poi_paging', {
  pageSize: pagination.pageSize,
  pageNum: pagination.current,
  name: keyword,
  cid: cityId,
  routerTagId
}).then(data => {
  const { list, total } = (data || {}) as any
  return {
    list: convertPoiListFromServer(list),
    pagination: {
      ...pagination,
      total: total || 0
    }
  }
})
/**
 * 获取多门店经营品类信息
 * @param routerTagId 品类id
 */
export const getMultiPoiTagInfo = (params: { routerTagId: number }) => httpClient.post('food/batch/r/multiRouterInfo', params)
  .then(data => {
    const { multiPoiSwitch, routerTagInfo, singlePoiTagFlag } = data
    return {
      multiPoiSwitch,
      isSinglePoi: !!singlePoiTagFlag,
      tagInfo: {
        id: routerTagInfo.id,
        level: routerTagInfo.level,
        name: routerTagInfo.name,
        tagList: routerTagInfo.tagIds
      }
    }
  })
/**
 * 获取多门店是否经营单一品类
 * @param routerTagId 品类id
 */
export const getMultiPoiIsSingleTag = async (params: { routerTagId: number }) => {
  const { isSinglePoi } = await getMultiPoiTagInfo(params)
  return isSinglePoi
}
/**
 * !!先富端 根据门店id获取门店信息!!
 * @param poiId 门店id
 * @param routerTagId 品类id
 * @param isBrand 是否大连锁
 */
export const getPoiInfoById = ({ poiId, routerTagId, isBrand }: {
  poiId: number,
  routerTagId: number,
  isBrand: boolean
}) => httpClient('sync_food/queryPoiById', {
  poiId: poiId,
  routerTagId,
  brandPoi: isBrand
}).then(convertPoiFromServer)
/**
 * routerTagId品类下，删除headPoiId门店，获取idList的信息
 * @param headPoiId 需要剔除的门店
 * @param routerTagId 品类id
 * @param isBrand 是否大连锁
 * @param idList 输入的门店id
 */
export const getPoiInfoListByExcludeIdList = ({ headPoiId, routerTagId, isBrand, idList }: {
  headPoiId: number,
  routerTagId: number,
  isBrand: boolean,
  idList: number[]
}) => httpClient('sync_food/queryPoisByIds', {
  poiId: headPoiId,
  routerTagId,
  brandPoi: isBrand,
  wmPoiIds: idList
}).then(convertPoiListFromServer)
/**
 * 查询idList对应的门店信息
 * @param idList 输入的门店id
 * @param routerTagId 品类id
 */
export const getPoiInfoListByIdList = ({ idList, routerTagId }: {
  idList: number[],
  routerTagId: number
}) => httpClient.post('food/batch/r/fillTargetPoi', {
  wmPoiIds: idList.join(','),
  routerTagId
}).then((data) => {
  data = (data || {}) as any
  return convertPoiListFromServer(data.wmPoiList || [])
})

/**
 * 门店是否有热卖推荐
 * @param poiId 门店id
 */
export const getPoiHotRecommend = ({ poiId }: { poiId: number }) => httpClient.post('retail/r/getScPoiHotSalesSwitch', {
  scPoiId: poiId
}).then(data => +data.switchCode === 1)

/**
 * 获取门店违规商品数量
 * @param poiId 门店id
 */
export const getPoiViolationInfo = ({ poiId }: { poiId: number }) => httpClient.post('inspection/r/haveProducts', {
  wmPoiId: poiId
}).then(data => data !== -1)

/**
 * 获取模块功能的白名单配置信息
 * @param poiId 门店id
 */
// export const getWhiteListModuleMap = ({ poiId }: { poiId: number }) => httpClient.post('retail/r/getWhiteListByPoiIdAndType', {
//   wmPoiId: poiId
// }).then(data => {
//   const { whiteList = [] } = data
//   const map = {}
//   whiteList.forEach((item) => {
//     map[item.type] = item.status === 1
//   })
//   return map
// })
/**
 * 获取模块功能的白名单配置信息
 * @param poiId 门店id
 */
export const getWhiteListModuleMap = ({ poiId } : { poiId: number }) => httpClient.post('shangou/r/getValidationConfigByWmPoiId', {
  wmPoiId: poiId
}).then(data => {
  let whiteMap = data || {}
  return convertWhiteListModuleMapFromServer(whiteMap)
})
/**
 * fieldId 即字段Id: 1.商品标题；2.包装规格；3.商品重量；4.商品单位；5.商品品牌；6.后台类目(商品类目)；7.商品名；
 * fieldStatus 即可编辑字段状态: 1.必填；2.选填；3.可编辑；4.不可编辑；
 * editableRuleType 即字段规则类型: 1.选填字段白名单；2.可编辑字段白名单；
 * @param poiId 门店id
 */
export const getWhiteListFieldMap = ({ poiId }: { poiId: number }) => httpClient.post('retail/r/optionalAndEditableDetail', {
  wmPoiId: poiId
}).then(data => {
  const editable = {} as any
  const editableList = data.editableList || []
  editableList.forEach((field) => {
    editable[WHITELIST_FIELDS_MAP[field.fieldId]] = field.fieldStatus === 3
  })
  // 目前后台配置中，两个字段都使用weight，前端区分为两个字段，故临时添加兼容处理；后期需要后端增强配置
  if (editable.weightUnit === undefined && editable.weight !== undefined) {
    editable.weightUnit = !!editable.weight
  }

  const required = {}
  const optionalList = data.optionalList
  optionalList.forEach((field) => {
    required[WHITELIST_FIELDS_MAP[field.fieldId]] = field.fieldStatus === 1
  })
  return {
    required,
    editable
  }
})

export const getPackageBagPrice = ({ poiId }: { poiId: number }) => httpClient.post('packageprice/r/get', {
  wmPoiId: poiId
}).then(data => {
  const { packagePrice, packagePriceRange } = (data || {}) as any
  return {
    price: packagePrice || 0,
    range: [{ label: '无', value: -1 }, ...packagePriceRange.map(i => ({ label: i.label, value: i.value }))]
  }
})

export const submitPackageBagPrice = ({ poiId, price } : { poiId: number, price: number }) => httpClient.post('packageprice/w/update', {
  wmPoiId: poiId,
  packetPayType: price === -1 ? 0 : 1,
  packetPrice: price === -1 ? 0 : price
})
/**
 * 字段控制 配置 - 应用到所有场景
 * limitSale = true, // 限购
 */
export const getFunctionConfig = ({ poiId } : { poiId: number }) => httpClient.post('retail/r/getFunctionConfig', {
  wmPoiId: poiId
}).then((data) => {
  const {
    limitSale = false // 限购
  } = data || {}
  return {
    limitSale
  }
})

/**
 * 字段控制 配置 - 应用到单店
 * shippingTime = true, // 可售时间
 * boxPrice = true, // 包装袋
 * descProduct = true, // 商品描述
 */
export const getFieldVisibleConfig = ({ poiId } : { poiId: number }) => httpClient.post('retail/r/getFieldVisibleConfig', {
  wmPoiId: poiId
}).then((data) => {
  const {
    shippingTime = true, // 可售时间
    boxPrice = true, // 包装袋
    descProduct = true, // 商品描述
    b2cSinglePoi = true // 运费模板
  } = data || {}
  return {
    sellTime: !!shippingTime,
    packBag: !!boxPrice,
    description: !!descProduct,
    b2cSinglePoi: !!b2cSinglePoi
  }
})

export const getPoiBusinessTemplateInfo = ({ poiId } : { poiId: number }) => httpClient.post('categoryTemplate/r/checkExistAndUseBTemplate', {
  wmPoiId: poiId
}).then((data) => {
  const { existStatus, useStatus } = (data || {}) as any
  return {
    exist: !!existStatus, // 门店是否存在b端模版
    used: !!useStatus // 门店是否使用b端模版
  }
})

export const getPoiAutoClearStockConfig = ({ poiId } : { poiId: number }) => httpClient.post('retail/r/stockConfig', poiId ? {
  wmPoiId: poiId
} : {
  merchantId: getMerchantId() || 0
}).then((data) => {
  const { productStockConfig = {}, tagStats = [], wmPoiIds = [] } = data || {}
  const {
    status,
    type,
    limitStop,
    syncNextDay,
    isAll,
    ruleId
  } = (productStockConfig || {}) as any
  if (status !== 1) { // 1:开启 2:关闭
    return {
      status: false,
      config: { ...defaultAutoClearStockConfig },
      productMap: {}
    }
  }
  return {
    status: true,
    wmPoiIds,
    config: {
      ruleId: ruleId,
      isAll: isAll,
      type: type || defaultAutoClearStockConfig.type, // 1:B端用户拒绝订单 2:C端商家拒绝订单
      syncStatus: !!(limitStop || {}).limitStopSyncStock,
      syncTime: (limitStop || {}).schedule || defaultAutoClearStockConfig.syncTime,
      stock: (syncNextDay || {}).syncNextDayStock ? syncNextDay.syncCount : defaultAutoClearStockConfig.stock
    },
    productMap: (tagStats || []).reduce((prev, next) => {
      prev[next.tagId] = {
        checked: false,
        list: next.includes
      }
      return prev
    }, {})
  }
})

export const submitPoiAutoClearStockConfig = ({ poiId, status, config, productMap } : {
  poiId: number,
  status: boolean,
  config: { [propname: string]: any },
  productMap: { [propname: string]: any }
}) => {
  let productStockConfig = {}
  let tagVos: object[] = []

  if (!status) {
    // 2 表示清空配置 1表示开启配置
    productStockConfig = { status: 2, ruleId: config.ruleId || 0 }
  } else {
    productStockConfig = {
      ruleId: config.ruleId || 0,
      isAll: config.isAll,
      status: 1,
      type: config.type,
      limitStop: {
        limitStopSyncStock: config.syncStatus,
        schedule: config.syncTime
      },
      syncNextDay: {
        syncNextDayStock: !isNil(config.stock),
        syncCount: config.stock
      }
    }
    if (!config.isAll) {
      tagVos = Object.entries(productMap).reduce((prev, [key, value]) => {
        const node = {
          tagId: key,
          includes: value.checked ? [] : value.list,
          excludes: value.checked ? value.list : []
        }
        // 全选 但是 exclude 小于 total 表示有选中的
        if (value.checked && value.list.length < value.total) {
          prev.push(node)
        } else if (!value.checked && value.list.length > 0) { // 非全选 但是 include有值，则表示有选中的
          prev.push(node)
        }
        // 否则 此分类不需要处理
        return prev
      }, [] as object[])
    }
  }
  let poiList = poiId ? [poiId] : []
  if (!poiId && config.isAll && config.poiList && config.poiList.length) {
    poiList = config.poiList
  }

  let body: any = {
    wmPoiIds: JSON.stringify(poiList),
    productStockConfig: JSON.stringify(productStockConfig),
    tagVos: JSON.stringify(tagVos)
  }
  if (!poiId) {
    body.merchantId = getMerchantId() || 0
  }
  return httpClient.post('retail/w/batchSaveStockConfig', body)
}

export const getPoiAuditProductStatistics = ({ poiId } : { poiId: number }) => httpClient.post('shangou/audit/r/statistics', {
  wmPoiId: poiId
}).then(data => convertAuditStatisticsFromServer(data))

export const getCellularProductTaskInfo = ({ poiId, spuId, awardCode, awardTypeCode } : { poiId: number, spuId: number, awardCode: string, awardTypeCode: string }) => httpClient.post('shangou/award/r/checkupAwardItemSpu', {
  wmPoiId: poiId,
  spuId,
  awardCode,
  awardTypeCode
})

export const getPoiAuditSpStatistics = ({ poiId } : { poiId: number }) => httpClient.get('shangou/medicine/audit/r/countAuditSp', {
  wmPoiId: poiId
}).then(data => convertAuditStatisticsFromServer(data))

export const getPoiProductCubeSwitch = ({ poiId } : { poiId: number }) => httpClient.post('shangou/cube/r/poiCubeSwitch', {
  wmPoiId: poiId
}).then(data => !!data)

export const getPoiProductCubeInfo = ({ poiId } : { poiId: number }) => httpClient.post('shangou/cube/r/cubeEntryGuide', {
  wmPoiId: poiId
}).then(data => {
  const { title, content } = (data || {}) as any
  return {
    title: title || '',
    description: content || ''
  }
})
// 获取门店的配置： 默认库存
export const getPoiConfig = ({ poiId } : { poiId: number }) => httpClient.post('shangou/cube/r/getCubeConfig', {
  wmPoiId: poiId
}).then(data => {
  const { defaultStock } = (data || {}) as any
  return {
    defaultStock: defaultStock || undefined
  }
})

/**
 * 商品上新推荐入口开关 (魔方二期)
 */
export const getProductNewArrivalSwitch = ({ poiId } : { poiId: number }) => httpClient.post('shangou/cube/r/v2/productRecSwitch', {
  wmPoiId: poiId
}).then(data => ({
  switch: data.switchFlag,
  tips: data.tips
}))

/**
 * 商品上新推荐文案 (魔方二期)
 */
// export const getProductNewArrivalInfo = ({ poiId } : { poiId: number }) => httpClient.post('shangou/cube/r/v2/productRecTips', {
//   wmPoiId: poiId
// }).then(data => data || '')

/**
 * 商品上新推荐tabList (魔方二期)
 * @param poiId
 */
export const getNewArrivalTabList = ({ poiId } : { poiId: number, }) => httpClient.post('shangou/cube/r/v2/getRecTabInfo', {
  wmPoiId: poiId
}).then(data => {
  data = data['cubeTabInfoVoList'] || []
  return data.map(tab => { tab.id = `${tab.id}`; return tab })
})

/**
 * 查询推广品牌商品灰度
 */
export const getBrandProductPromotionGray = ({ poiId }: { poiId: number }) => httpClient.post('/retail/r/getBrandProductPromotionGray', { wmPoiId: poiId }).then(data => {
  const { gray = false } = data || {}
  return !!gray
})
/**
 * 商品上新推荐tabList (魔方二期)
 * @param poiId
 */
export const getMultiCubeScopeList = () => httpClient.post('hqcc/r/getAllPoiInfo').then(data => {
  data = data['poiDetails'] || []
  return data
})
