import {
  initTag
} from '@/data/helper/category/operation'
import {
  updateTreeChildrenWith
} from '@/common/arrayUtils'
import {
  TAG_OPERATION_TYPE as TYPE
} from '@/data/enums/category'

const deleteItem = (list, node) => {
  const index = list.findIndex(n => n.id === node.id)
  const result = [...list]
  result.splice(index, 1)
  return result
}
const addItem = (list, node) => {
  const result = [...list]
  result.push(node)
  return result
}
const updateItem = (list, node) => {
  const index = list.findIndex(n => n.id === node.id)
  const result = [...list]
  result.splice(index, 1, node)
  return result
}
const updateItemByParentId = (list, parentId, fn) => {
  const index = list.findIndex(n => n.id === parentId)
  const parentTag = list[index]
  const newTag = fn(parentTag)
  const result = [...list]
  result.splice(index, 1, newTag)
  return result
}

const updateTagList = (tagTree, type, oldTag, newTag) => {
  if (type === TYPE.CREATE) {
    let pathList = newTag.parentId ? [newTag.parentId] : []
    return updateTreeChildrenWith(tagTree, pathList, (list) => {
      return addItem(list, newTag)
    })
  }
  if (type === TYPE.SET_CHILD_TAG) {
    const newTree = updateTreeChildrenWith(tagTree, [], (list) => deleteItem(list, oldTag))
    return updateTreeChildrenWith(newTree, [], list => {
      return updateItemByParentId(list, newTag.parentId, (tag) => {
        const { children, productCount, ...rest } = tag
        return {
          ...rest,
          isLeaf: false,
          children: addItem(children || [], newTag),
          productCount: productCount + newTag.productCount
        }
      })
    })
  }
  if (type === TYPE.SET_FIRST_TAG) {
    const newTree = updateTreeChildrenWith(tagTree, [], list => {
      return updateItemByParentId(list, oldTag.parentId, (tag) => {
        const { children, productCount, ...rest } = tag
        const newChildren = deleteItem(children, oldTag)
        return {
          ...rest,
          isLeaf: newChildren.length > 0,
          children: newChildren,
          productCount: productCount - oldTag.productCount
        }
      })
    })
    return updateTreeChildrenWith(newTree, [], list => addItem(list, newTag))
  }
  if ([TYPE.TITLE, TYPE.TOP_TIME].includes(type)) {
    let pathList = newTag.parentId ? [newTag.parentId] : []
    return updateTreeChildrenWith(tagTree, pathList, list => updateItem(list, newTag))
  }
  if (type === TYPE.ADD_CHILD_TAG) {
    return updateTreeChildrenWith(tagTree, [], list => {
      return updateItemByParentId(list, newTag.parentId, (tag) => {
        const { children, productCount, ...rest } = tag
        return {
          ...rest,
          isLeaf: false,
          children: addItem(children, newTag),
          productCount: productCount + newTag.productCount
        }
      })
    })
  }
  return tagTree
}

const createTag = (parentTag, type, params) => {
  if (type === TYPE.ADD_CHILD_TAG) {
    return addSubTag(parentTag, params)
  }
  return {
    ...initTag,
    ...params
  }
}

const updateTag = (tag, type, params) => {
  if (type === TYPE.SET_CHILD_TAG) {
    return changeTagToSubLevel(tag, params)
  }
  if (type === TYPE.SET_FIRST_TAG) {
    return changeTagToFirstLevel(tag)
  }
  return { ...tag, ...params }
}

const addSubTag = (parentTag, params) => {
  return {
    ...initTag,
    level: parentTag.level + 1,
    parentId: parentTag.id,
    parentName: parentTag.name,
    productCount: parentTag.isLeaf ? parentTag.productCount : 0,
    ...params
  }
}

const changeTagToSubLevel = (tag, params) => {
  const node = {
    ...initTag,
    ...params,
    level: 1,
    id: tag.id,
    name: tag.name,
    productCount: tag.productCount
  }
  return node
}

const changeTagToFirstLevel = (tag) => {
  const node = {
    ...initTag,
    id: tag.id,
    name: tag.name,
    productCount: tag.productCount
  }
  return node
}

export default {
  updateTag,
  createTag,
  updateTagList
}
