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

export const setNodeInfo = (checkBoxList, item, dataSource) => {
  const isLeaf = isLeafNode(item) // 是否叶子节点
  const id = item.id
  const parentIdList = item.parentIdList
  const nodePath = `${parentIdList.join('.selected.') ? parentIdList.join('.selected.') + '.selected.' : ''}${id}` // 叶子结点路径
  if (parentIdList.length) {
    parentIdList.reduce((a, b) => {
      a.push(b)
      const nodePath = a.join('.selected.')
      console.log('nodePath', nodePath)
      const nodeInfo = get(checkBoxList, nodePath)
      const total = getTotalNum(a, dataSource)
      if (nodeInfo === undefined && nodePath) {
        setWith(checkBoxList, nodePath, {
          selected: {},
          leaf: false,
          checked: { value: false, indeterminate: false },
          total: total
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
      total: getTotalNum(parentIdList.concat(id), dataSource)
    }, Object)
  } else {
    setWith(checkBoxList, nodePath, {
      selected: {},
      leaf: false,
      checked: { value: true, indeterminate: false },
      total: getTotalNum(parentIdList.concat(id), dataSource)
    }, Object)
    item.children.forEach(child => setNodeInfo(child))
  }
}
