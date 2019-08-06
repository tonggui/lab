/**
 * 更新数组
 * @param {*} arr 数组
 * @param {*} value 更新的值
 * @param {*} fn find函数
 */
export const updateArrayWith = (arr, value, fn) => {
  const index = arr.findIndex(fn)
  if (index < 0) {
    return arr
  }
  return [...arr].splice(index, 1, {
    ...arr[index],
    ...value
  })
}
/**
 * 数组挪动位置
 * @param {*} arr 数组
 * @param {*} oldIndex 之前位置
 * @param {*} newIndex 之后位置
 */
export const swapArrayByIndex = (arr, oldIndex, newIndex) => {
  const result = [...arr]
  result.splice(newIndex, 0, result.splice(oldIndex, 1)[0])
  return result
}
/**
 * 更新树中某一段
 * @param {*} tree 树结构
 * @param {*} pathList 路径
 * @param {*} list 更新的数组
 */
export const updateTreeChildrenWith = (tree, pathList, fn) => {
  if (pathList.length <= 0) {
    if (!fn) {
      fn = (l) => {
        if (!l) {
          return []
        }
        return [...l]
      }
    }
    return fn(tree) || []
  }
  const id = pathList[0]
  const index = tree.findIndex(i => i.id === id)
  const item = tree[index]
  const newChildren = updateTreeChildrenWith(item.children, pathList.slice(1), fn)
  const result = [...tree]
  result[index] = {
    ...item,
    children: newChildren
  }
  return result
}

export const itemIsInArr = (tree, id) => {
  return tree.some(item => {
    if (item.isLeaf && item.id === id) {
      return true
    }
    if (!item.isLeaf) {
      return itemIsInArr(item.children || [], id)
    }
  })
}

export const updateTreeNode = (tree, tagId, params) => {
  if (tree.length <= 0) {
    return tree
  }
  return tree.map(item => {
    if (item.isLeaf && item.id === tagId) {
      return { ...item, ...params }
    }
    if (!item.isLeaf) {
      return {
        ...item,
        children: updateTreeNode(item.children || [], tagId, params)
      }
    }
    return item
  })
}
