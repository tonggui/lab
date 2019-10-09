/**
 * 多选级联 value Tree
 * Node结构
 * {
 *  checked: boolean // 用户是否勾选
 *  list: [] // 勾选状态下 表示exclude 不勾选状态下 表示 include
 *  id: number // 当前节点的id
 * }
 * @param {*} checked boolean
 */

export const ALL = Symbol('all')

/**
 * 创建一个默认树跟节点
*/
export const createRootNode = (total, checked = false) => ({
  id: ALL,
  checked: checked,
  total: total || 0,
  list: []
})

/**
 * 判断一个节点是否有选择的
 * @param {*} node 节点
 */
export const _isSelected = (node) => {
  // 叶子节点
  if (node.total === 0) {
    return node.checked
  }
  if (!node.checked) {
    return node.list.some(n => _isSelected(n))
  }
  return node.list.length < node.total || node.list.some(n => _isSelected(n))
}

export const _isChecked = (node) => {
  if (node.total === 0) {
    return node.checked
  }
  if (!node.checked) {
    return node.list.length === node.total && node.list.every(n => _isChecked(n))
  }
  return node.list.length === 0 || node.list.every(n => _isChecked(n))
}

/**
 * 获得一个节点的selected 和 checked 状态
 * @param {*} rootNode 根结点
 * @param {*} pathList 路径id
 * @param {*} item 节点
 */
export const getNodeStatus = (rootNode, pathList, item) => {
  if (item.id === ALL) {
    return {
      checked: _isChecked(rootNode),
      selected: _isSelected(rootNode)
    }
  }
  let checked = false
  let selected = false
  // 递归出口
  if (pathList.length <= 0) {
    const node = rootNode.list.find(i => i.id === item.id)
    checked = node ? _isChecked(node) : rootNode.checked
    selected = node ? _isSelected(node) : rootNode.checked
    return { selected, checked }
  }
  const parentId = pathList[0]
  const node = rootNode.list.find(i => i.id === parentId)
  if (node) {
    return getNodeStatus(node, pathList.slice(1), item)
  }
  return {
    checked: rootNode.checked,
    selected: rootNode.checked
  }
}

export const toggleNodeStatus = (rootNode, parentNodeList, item, status) => {
  // 全选操作
  if (item.id === ALL) {
    return {
      ...rootNode,
      list: [],
      checked: status
    }
  }
  const list = [...rootNode.list]
  if (parentNodeList.length <= 0) {
    const index = list.findIndex(n => n.id === item.id)
    if (index >= 0) {
      if (rootNode.checked === status) {
        list.splice(index, 1)
      } else {
        list[index].checked = status
        list[index].list = []
      }
    } else {
      list.push({
        id: item.id,
        checked: status,
        total: item.total || 0,
        list: []
      })
    }
    return {
      ...rootNode,
      list
    }
  }
  const parentNode = parentNodeList[0]
  const newParentNodeList = parentNodeList.slice(1)
  const index = list.findIndex(i => i.id === parentNode.id)
  let node
  if (index >= 0) {
    node = toggleNodeStatus(list[index], newParentNodeList, item, status)
    list.splice(index, 1, node)
  } else {
    node = {
      id: parentNode.id,
      checked: rootNode.checked,
      total: parentNode.total,
      list: []
    }
    node = toggleNodeStatus(node, newParentNodeList, item, status)
    list.push(node)
  }
  return {
    ...rootNode,
    list
  }
}
