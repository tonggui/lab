import { Tag } from '../interface/category'
import { CANCEL_ORDER_TYPE, STATUS } from '../enums/poi'

// 默认全部商品 tagId
export const defaultTagId: number = 0
export const allProductTag: Tag = {
  name: '全部商品',
  parentId: -1, // 伪造
  parentName: '',
  id: defaultTagId,
  isUnCategorized: false,
  productCount: 0,
  level: 0,
  isLeaf: true,
  children: [] as Tag[]
}

export const defaultAutoClearStockConfig = {
  type: [CANCEL_ORDER_TYPE.MERCHANT, CANCEL_ORDER_TYPE.CUSTOMER],
  syncStatus: false,
  syncTime: '00:00',
  stock: null,
  isAll: false,
  ruleId: null
}

export const AUDIT_INFO = {
  [STATUS.NOT_AUDITED]: {
    description: '至少创建5个商品才可提交审核，请尽快创建'
  },
  [STATUS.AUDITING]: {
    title: '商品审核中，请耐心等待',
    description: '商品审核期间不可编辑，审核通过后可继续创建'
  },
  [STATUS.REJECTED]: {
    title: '',
    description: '审核未通过，请修改后重新提交，'
  }
}
