import { Tag } from "../interface/category";

// 默认全部商品 tagId
export const defaultTagId: number = 0
export const allProductTag: Tag = {
  name: '全部商品',
  parentId: -1, // 伪造
  parentName: '',
  id: defaultTagId,
  isUnCategorized: false,
  productCount: 0,
  level: 1,
  isLeaf: true,
  children: [] as Tag[]
}
