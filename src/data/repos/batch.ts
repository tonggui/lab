import { isArray, defaultTo } from 'lodash'
import { isMedicine } from '@/common/app'
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
  submitBatchCreateByExcel as medicineBatchCreateByExcel,
  submitBatchModifyByExcel as medicineBatchModifyByExcel
} from '../api/medicine'

export {
  getBatchSyncTaskList as fetchBatchSyncTaskList,
  submitBatchSync as fetchSubmitBatchSync,
  getBatchSyncBrandDesc as fetchBatchSyncBrandDesc,
  submitBatchCreateByProduct as fetchSubmitBatchCreateByProduct,
  submitBatchUploadImg as fetchSubmitBatchUploadImg
} from '../api/batch'

export const fetchSubmitBatchCreateByExcel = (poiIdList, multiPoiFlag, useSpLibPicture, file) => {
  // 是否是药品判断
  let api = submitBatchCreateByExcel
  if (isMedicine()) {
    api = medicineBatchCreateByExcel
  }
  return api({
    poiIdList,
    multiPoiFlag,
    file,
    useSpLibPicture
  })
}

export const fetchSubmitBatchDelete = (params: {
  matchRuleList: MatchRule[],
  poiIdList: number[],
}) => {
  const { matchRuleList: list, poiIdList } = params;
  const matchRuleList = list.map((rule: MatchRule) => {
    const { tagName } = rule.value
    let newTagName: any = tagName
    if (isArray(tagName)) {
      newTagName = tagName.map(({ name }) => name).join(',')
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
  // 是否是药品判断
  let api = submitBatchModifyByExcel
  if (isMedicine()) {
    api = medicineBatchModifyByExcel
  }
  return api({
    poiIdList,
    multiPoiFlag,
    excelType,
    file
  })
}

export const fetchSubmitBatchModifyByProduct = (params: {
  matchRuleList: {
    rule: MatchRule,
    modify: ProductModify
  }[],
  poiIdList: number[]
}) => {
  const { poiIdList, matchRuleList: list } = params;
  const matchRuleList = list.map(({ rule, modify }) => {
    const { tagName } = rule.value
    let newTagName: any = tagName
    if (isArray(tagName)) {
      newTagName = tagName.map(({ name }) => name).join(',')
    }
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
      toLabels: modify.labelList,
      toDescription: modify.description, // 修改的商品描述
      toProductPics: modify.pictureList.join(','), // 修改的商品图片
      toCategoryId: isArray(modify.categoryId) ? (modify.categoryId as number[]).slice(-1)[0] : modify.categoryId, // 修改的商品类目
      toTagList: isArray(modify.tagList) ? modify.tagList.map(({ id }) => id) : (modify.tagList && [modify.tagList]), // 商品店内分类
      toPicContent: modify.pictureContentList.join(','), // 商品图文详情
    }
  });
  return submitBatchModifyByProduct({
    poiIdList,
    matchRuleList
  })
}