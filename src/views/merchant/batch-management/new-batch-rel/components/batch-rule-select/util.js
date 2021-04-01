import { BATCH_MATCH_TYPE } from '@/data/enums/batch'

let id = 0

export const getInitValue = ({ isMedicine = false, isSinglePoi = false } = {}) => {
  return {
    type: isMedicine ? BATCH_MATCH_TYPE.UPC : BATCH_MATCH_TYPE.PRODUCT,
    value: {
      productName: '',
      tagName: isSinglePoi ? [] : '',
      upc: '',
      sku: ''
    }
  }
}

export const createRule = (context = {}, params = {}) => {
  return {
    id: `batch-match-rule-${id++}`,
    ...getInitValue(context),
    ...params
  }
}
