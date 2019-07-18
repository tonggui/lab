import httpClient from '../client/instance/product'
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
  convertTipList as convertTipListFromServer,
} from '../helper/common/convertFromServer'
import {
  convertPoiList as convertPoiListFromServer,
  convertPoi as convertPoiFromServer
} from '../helper/poi/convertFromServer'

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
export const getPoiAuditInfo = ({ poiId }: { poiId: number }) => httpClient.post('food/r/getWmPoiAuditInfo', {
  wmPoiId: poiId
}).then(data => {
  data = data || {}
  return ({
    status: data.status,
    message: data.msg || ''
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
export const getListPageData = (params: { poiId?: number }) => httpClient.post('retail/r/listPageModel', params)
  .then(data => ({
    hasTransitionProduct: data.hasTransitionProduct === 1,
    hasPackageBag: data.packetSupport === 1,
    errorProductCount: data.errorProductCount || 0,
    unRelationProductCount: data.unRelationProductCount || 0
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
  pagSize: pagination.pageSize,
  pageNum: pagination.current,
  name: keyword,
  cid: cityId,
  routerTagId,
}).then(data => {
  const { list, total } = data
  return {
    list: convertPoiListFromServer(list),
    pagination: {
      ...pagination,
      total
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
      tagList: routerTagInfo.tagIds,
    }
  }
})
/**
 * 获取多门店是否经营单一品类
 * @param routerTagId 品类id
 */
export const getMultiPoiIsSingleTag = async (params: { routerTagId: number }) => {
  const { tagInfo } = await getMultiPoiTagInfo(params)
  return tagInfo.id
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
  wmPoiIds: idList,
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
  wmPoiIds: idList,
  routerTagId
}).then(convertPoiListFromServer)
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
export const getWhiteListModuleMap = ({ poiId }: { poiId: number }) => httpClient.post('retail/r/getWhiteListByPoiIdAndType', {
  wmPoiId: poiId
}).then(data => {
  const { whiteList = [] } = data
  const map = {}
  whiteList.forEach((item) => {
    map[item.type] = item.status === 1
  })
  return map
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
  const editable = {} as any;
  const editableList = data.editableList || [];
  editableList.forEach((field) => {
    editable[WHITELIST_FIELDS_MAP[field.fieldId]] = field.fieldStatus === 3;
  });
  // 目前后台配置中，两个字段都使用weight，前端区分为两个字段，故临时添加兼容处理；后期需要后端增强配置
  if (editable.weightUnit === undefined && editable.weight !== undefined) {
    editable.weightUnit = !!editable.weight;
  }

  const required = {};
  const optionalList = data.optionalList;
  optionalList.forEach((field) => {
    required[WHITELIST_FIELDS_MAP[field.fieldId]] = field.fieldStatus === 1;
  });
  return {
    required,
    editable,
  }
})
