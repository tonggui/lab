import { isArray, defaultTo } from 'lodash'
import {
  MatchRule,
  ProductModify
} from '../interface/product'
import {
  submitBatchCreateByExcel,
  submitBatchDelete,
  submitBatchModifyByExcel,
  submitBatchModifyByProduct
} from '../api/batch'
import {
  submitMedicineBatchCreateExcel
} from '../api/medicineMerchantApi/batchMenagement'
import { isAssociateMedicineMerchant } from '../../module/helper/utils'

export {
  getBatchSyncTaskList as fetchBatchSyncTaskList,
  submitBatchSync as fetchSubmitBatchSync,
  getBatchSyncBrandDesc as fetchBatchSyncBrandDesc,
  submitBatchCreateByProduct as fetchSubmitBatchCreateByProduct,
  submitBatchUploadImg as fetchSubmitBatchUploadImg
} from '../api/batch'

export const fetchSubmitBatchCreateByExcel = async (poiIdList, isMultiPoi, useSpLibPicture, file) => {
  // 判断当前门店是否关联商家商品中心，若已关联，创建商品到商家商品中心再关联到当前门店，若未关联，创建商品到门店
  return await isAssociateMedicineMerchant() ? submitMedicineBatchCreateExcel({
    wmPoiIds: [poiIdList],
    file,
    fillPicBySp: useSpLibPicture
  }) : submitBatchCreateByExcel({
    poiIdList,
    multiPoiFlag: !!isMultiPoi,
    file,
    useSpLibPicture
  })
}

export const fetchSubmitBatchDelete = (params: {
  matchRuleList: MatchRule[],
  poiIdList: number[],
}) => {
  const { matchRuleList: list, poiIdList } = params
  const matchRuleList = list.map((rule: MatchRule) => {
    const { tagName } = rule.value
    let newTagName: any = tagName
    if (isArray(tagName)) {
      newTagName = tagName!.map(({ name }) => name).join(',')
    }
    return {
      ruleType: rule.type,
      tagName: newTagName, // 分类名称
      productName: rule.value.productName, // 商品标题
      specName: '', // 规格名称
      upc: rule.value.upc, // UPC/EAN/条码
      sku: rule.value.sku // SKU码/货号
    }
  })
  return submitBatchDelete({
    matchRuleList,
    poiIdList
  })
}

export const fetchSubmitBatchModifyByExcel = (poiIdList, multiPoiFlag, excelType, file) => {
  return submitBatchModifyByExcel({
    poiIdList,
    file,
    multiPoiFlag,
    excelType
  })
}

export const fetchSubmitBatchModifyByProduct = (params: {
  matchRuleList: {
    rule: MatchRule,
    modifyValue: ProductModify
  }[],
  poiIdList: number[]
}) => {
  const { poiIdList, matchRuleList: list } = params
  const matchRuleList = list.map(({ rule, modifyValue: modify }) => {
    const { tagName } = rule.value
    let newTagName: any = tagName
    if (isArray(tagName)) {
      newTagName = tagName!.map(({ name }) => name).join(',')
    }
    const category = (modify.category && modify.category.idPath) || ''
    return {
      ruleType: rule.type,
      tagName: newTagName, // 分类名称
      productName: rule.value.productName, // 商品标题
      specName: '', // 规格名称
      upc: rule.value.upc, // UPC/EAN/条码
      sku: rule.value.sku, // SKU码/货号
      toName: modify.name,
      toPrice: defaultTo(modify.price, ''),
      toStock: defaultTo(modify.stock, ''),
      toSellStatus: defaultTo(modify.sellStatus, ''),
      toWeightTip: '',
      toWeight: '',
      toBoxPrice: '',
      toBoxNum: '',
      toLabels: (modify.labelList || []).map(l => l.value),
      toDescription: modify.description, // 修改的商品描述
      toProductPics: (modify.pictureList || []).join(','), // 修改的商品图片
      toCategoryId: isArray(category) ? (category).slice(-1)[0] : category, // 修改的商品类目
      toTagList: isArray(modify.tagList) ? modify.tagList!.map(({ id }) => id) : (modify.tagList && [modify.tagList]), // 商品店内分类
      toPicContent: (modify.pictureContentList || []).join(',') // 商品图文详情
    }
  })
  return submitBatchModifyByProduct({
    poiIdList,
    matchRuleList
  })
}
