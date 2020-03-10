import {
  convertProductDetail
} from '../withCategoryAttr/convertFromServer'

export const convertAuditProductDetail = data => {
  const product = convertProductDetail(data.productSpu || {})
  return {
    ...product,
    currentMis: data.currentMis,
    processId: data.processId,
    taskList: data.tasks || [],
    snapshot: data.snapshot || {}
  }
}