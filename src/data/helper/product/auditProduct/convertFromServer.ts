import {
  convertProductDetail
} from '../withCategoryAttr/convertFromServer'
import {
  convertCategoryAttrMap
} from '../utils'
import { trimSplit } from '@/common/utils'

export const convertAuditProductDetail = data => {
  const product = convertProductDetail(data.productSpu || {})
  const snapshot = data.snapshot || {}
  const upcCode = snapshot.upc
  const category = snapshot.category || {}
  const { valueMap } = convertCategoryAttrMap(snapshot.categoryAttrMap)
  return {
    ...product,
    currentMis: data.currentMis,
    processId: data.processId,
    taskList: data.tasks || [],
    snapshot: {
      upcCode,
      category: category ? {
        id: category.categoryId,
        idPath: trimSplit(category.idPath).map(v => +v),
        name: category.categoryName,
        namePath: trimSplit(category.categoryNamePath)
      } : undefined,
      categoryAttrValueMap: valueMap
    }
  }
}