import { Tag } from "../interface/category";
import { CANCEL_ORDER_TYPE } from '../enums/poi';

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
  stock: null
}
