import {
  convertProductDetail
} from '../withCategoryAttr/convertFromServer'
import {
  convertCategoryAttrMap
} from '../utils'
import { PRODUCT_AUDIT_STATUS } from '../../../enums/product'
import { trimSplit } from '@/common/utils'

const convertSnapshotNode = snapshot => {
  const { category = {}, categoryAttrMap = {}, ...others } = snapshot || {}
  const { valueMap } = convertCategoryAttrMap(categoryAttrMap)
  return {
    ...others,
    category: category ? {
      id: category.categoryId,
      idPath: trimSplit(category.idPath).map(v => +v),
      name: category.categoryName,
      namePath: trimSplit(category.categoryNamePath)
    } : undefined,
    normalAttributesValueMap: valueMap
  }
}

export const convertAuditProductDetail = data => {
  const product = convertProductDetail(data.productSpu || {})
  const state = data.state || 0 // 审核流状态，1-审核中，2-审核通过，3-暂不处理, 4-撤销, 5-审核驳回
  const dataSource = data.dataSource || 2 // 数据来源 1-运营，2-商家申报，3-商家纠错，4-品牌商，5-品牌商纠错，6-商家回流
  let auditStatus = 0
  if (state === 1 || state === 2) {
    auditStatus = state
  } else if (state === 4) {
    auditStatus = PRODUCT_AUDIT_STATUS.AUDIT_REVOCATION
  } else if (state === 5) {
    auditStatus = dataSource === 3 ? PRODUCT_AUDIT_STATUS.AUDIT_CORRECTION_REJECTED : PRODUCT_AUDIT_STATUS.AUDIT_REJECTED
  }
  return {
    ...product,
    auditStatus,
    productSource: dataSource,
    currentMis: data.currentMis,
    processId: data.processId,
    taskList: data.tasks || [],
    snapshot: convertSnapshotNode(data.snapshot),
    approveSnapshot: convertSnapshotNode(data.auditorUpdateBeforeData)
  }
}
