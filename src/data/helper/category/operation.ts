import { TagWithSort } from "@/data/interface/category";
import { initTimeZone } from '@/data/constants/common'
import { defaultTagId } from "@/data/constants/poi";

export const newCustomValuePrefix = '_'

export const initTag: TagWithSort = {
  id: '', // 新建的时候默认为0
  name: '',
  level: 0,
  isLeaf: true, // 是否是叶子节点
  parentId: defaultTagId, // 父节点id
  parentName: '', // 父节点名称
  isUnCategorized: false, // 是否是未分类
  productCount: 0, // 分类下商品数目
  topFlag: false, // 分时置顶
  timeZone: initTimeZone, // 分类置顶信息
  children: ([] as TagWithSort[]), // 子分类
  isSmartSort: false // 智能分类
}
export const createSubTag = (parentTag: TagWithSort): TagWithSort => {
  const node: TagWithSort = {
    ...initTag,
    level: parentTag.level + 1,
    parentId: parentTag.id,
    parentName: parentTag.name,
    productCount: parentTag.isLeaf ? parentTag.productCount : 0
  }
  return node
}

