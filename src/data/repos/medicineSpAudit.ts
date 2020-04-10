import _ from 'lodash'
import {
  spAuditDetail,
  commitAuditSp,
  saveOrUpdateSpInfo,
  cancelAuditSp,
  getAuditSpList,
  submitDeleteSpAudit,
  getAuditSpSearchSuggestion
} from '../api/medicineSpAudit'

import {
  getCategoryAttrs
} from '../api/medicine'
import { VALUE_TYPE } from '@/data/enums/category'
import { PRODUCT_AUDIT_STATUS } from '@/data/enums/product'
import { MedicineAuditStandardProduct } from '@/data/interface/product'
import { CategoryAttr } from '@/data/interface/category'
import { Pagination } from '@/data/interface/common';

export {
  isAuditApplyEnabled
} from '../api/medicineSpAudit'

export const fetchSpAuditDetailInfo = async (poiId: string, spId: number) => {
  const { standardProductVo, tasks } = await spAuditDetail({ poiId, spId })
  const valueMap = {}
  let categoryAttrList: CategoryAttr[] = []
  if (standardProductVo.category) {
    categoryAttrList = await getCategoryAttrs({ poiId, categoryId: standardProductVo.category.id })
    const attrValueList = standardProductVo.attrValueList || []
    // 清洗支持自定义扩展的数据，清除已选择数据，将数据设置到attrList中，同时设置valueMap
    for (const attrValueItem of attrValueList) {
      const categoryAttrItem = categoryAttrList.find(categoryAttrItem => categoryAttrItem.id === attrValueItem.attrId)
      if (!categoryAttrItem) {
        // 如果未找到对应的类目属性，则过滤属性
        continue
      }
      let value
      switch (categoryAttrItem.valueType) {
        case VALUE_TYPE.INPUT:
          value = attrValueItem.extension
          break
        case VALUE_TYPE.SINGLE_SELECT:
          value = attrValueItem.valudId
          break
        case VALUE_TYPE.MULTI_SELECT:
          value = _.split(attrValueItem.valudId, ',')
          break
      }
      valueMap[categoryAttrItem.id] = value
    }
  }
  return {
    tasks,
    ...standardProductVo,
    categoryAttrValueMap: valueMap,
    categoryAttrList
  }
}

export const saveOrUpdate = (poiId: string, spId: number, product: MedicineAuditStandardProduct) => {
  return saveOrUpdateSpInfo({ poiId, spId, product })
}

export const commitAudit = (poiId: string, spId: number, product: MedicineAuditStandardProduct) => {
  return commitAuditSp({ poiId, spId, product })
}

export const cancelAudit = (spId: number) => cancelAuditSp({ spId })

export const fetchSubmitDeleteSpAudit = (spId: number, poiId: number) => submitDeleteSpAudit({ spId, poiId })

export const fetchGetAuditSpList = (filter: {
  auditStatus: PRODUCT_AUDIT_STATUS[],
  searchWord: string
}, pagination: Pagination, poiId: number) => getAuditSpList({
  pagination,
  poiId,
  ...filter})

export const fetchGetAuditSpSearchSuggestion = (keyword: string, poiId: number) => getAuditSpSearchSuggestion({ keyword, poiId })
