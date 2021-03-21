import { get, isArray, setWith } from 'lodash'

export const isLeafNode = (item) => {
  return !item.children || item.children.length <= 0
}

export const getTotalNum = (parentIdList, dataSource) => {
  let total = 0
  let children = dataSource
  parentIdList.forEach(it => {
    const node = children.find(item => item.id === it)
    if (node.children && isArray(node.children)) children = node.children
  })
  total = children.length || 0
  return total
}

export const initNodeInfo = (checkBoxList, item, dataSource) => {
  const isLeaf = isLeafNode(item) // 是否叶子节点
  const id = item.id
  const parentIdList = item.parentIdList
  const nodePath = `${parentIdList.join('.selected.') ? parentIdList.join('.selected.') + '.selected.' : ''}${id}` // 叶子结点路径
  if (parentIdList.length) {
    parentIdList.reduce((a, b) => {
      a.push(b)
      const nodePath = a.join('.selected.')
      const nodeInfo = get(checkBoxList, nodePath)
      const total = getTotalNum(a, dataSource)
      if (nodeInfo === undefined && nodePath) {
        setWith(checkBoxList, nodePath, {
          selected: {},
          leaf: false,
          checked: { value: false, indeterminate: false },
          total: total,
          selectedTotal: 0
        }, Object)
      }
      return a
    }, [])
  }
  if (isLeaf) {
    setWith(checkBoxList, nodePath, {
      includeSpuIds: [],
      excludeSpuIds: [],
      leaf: true,
      checked: { value: true, indeterminate: false },
      total: item.productCount,
      selectedTotal: 0
    }, Object)
  } else {
    setWith(checkBoxList, nodePath, {
      selected: {},
      leaf: false,
      checked: { value: true, indeterminate: false },
      total: getTotalNum(parentIdList.concat(id), dataSource),
      selectedTotal: 0
    }, Object)
    item.children.forEach(child => initNodeInfo(child))
  }
}

export const getCheckStatus = (checked) => {
  let status = 1
  const { value, indeterminate } = checked
  if (value && !indeterminate) status = 1
  else if (value && indeterminate) status = 0.5
  return status
}

export const setCheckStatus = (checkBoxList, status, node) => {
  if (status === 1) {
    node.checked.value = true
    node.checked.indeterminate = false
  } else if (status > 0 && status < 1) {
    node.checked.value = true; node.checked.indeterminate = true
  } else deleteSelectedNode(checkBoxList, node.parentIdList, node.id)
}

export const deleteSelectedNode = (checkBoxList, parentIdList, id) => {
  // 删除自身节点以及向上节点
  const path = `${parentIdList.join('.selected.') ? parentIdList.join('.selected.') + '.selected' : ''}`
  if (path) delete get(checkBoxList, path)[id]
  else delete checkBoxList[id]

  if (parentIdList.length) {
    for (let i = parentIdList.length; i >= 0; i--) {
      const pNodePath = `${parentIdList.join('.selected') ? parentIdList.join('.selected') : ''}` // 非叶子结点路径
      const nodeInfo = get(checkBoxList, pNodePath)
      if (nodeInfo.selected && !Object.keys(nodeInfo.selected).length) delete nodeInfo['selected']
    }
  }
}

export const calculateSelectedTotal = (node) => {
  if (node.leaf) {
    // node.selectedTotal = node.total
    const { includeSpuIds, excludeSpuIds, total } = node
    if (!includeSpuIds.length && !excludeSpuIds.length) return total
    else if (includeSpuIds.length && !excludeSpuIds.length) return includeSpuIds.length
    else if (!includeSpuIds.length && excludeSpuIds.length) return total - excludeSpuIds.length
    else return 0
  } else {
    if (node.selected) {
      return Object.values(node.selected).reduce((a, b) => {
        a += calculateSelectedTotal(b)
        return a
      }, 0)
    }
  }
  // const { checked: { value, indeterminate } } = node
  // if (value && !indeterminate) {
  //   node.selectedTotal
  // } else {
  //   node.selectedTotal = 0
  // }
}
