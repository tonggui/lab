import { isArray, get } from 'lodash'
import { initNodeInfo, getCheckStatus, setCheckStatus, deleteSelectedNode } from '@components/tag-tree-with-checkbox/model'

export const getProductParentNodeList = (product, tag) => {
  const productTagList = get(product, 'tagList')
  const productTag = isArray(productTagList) ? productTagList[0] : productTagList
  let parentIdList = [productTag.parentId, productTag.id]
  // if (tag) {
  //   parentIdList = [...tag.parentIdList, tag.id]
  // } else {
  //   parentIdList = [productTag.parentId, productTag.id]
  // }
  return parentIdList
}

export function findTagInfo (data, tagListSource, currentTag, checkBoxList) {
  const product = isArray(data) ? data[0] : data
  const id = product.id
  const parentIdList = getProductParentNodeList(product, currentTag)
  const path = parentIdList.join('.selected.')
  let nodeInfo = get(checkBoxList, path)
  if (nodeInfo === undefined) {
    // TODO 创建
    let item = tagListSource
    let i = 0
    for (; i < parentIdList.length - 1; i++) {
      item = item.find(it => it.id === parentIdList[i]).children
    }
    item = item.find(it => it.id === parentIdList[i])
    initNodeInfo(checkBoxList, item, tagListSource)
    nodeInfo = get(checkBoxList, path)
    nodeInfo.includeSpuIds.push(id)
  } else {
    if (!nodeInfo.includeSpuIds.length && !nodeInfo.excludeSpuIds.length) {
      nodeInfo.excludeSpuIds.push(id)
    } else if (nodeInfo.includeSpuIds.includes(id)) {
      let idx = nodeInfo.includeSpuIds.indexOf(id)
      nodeInfo.includeSpuIds.splice(idx, 1)
    } else if (nodeInfo.excludeSpuIds.includes(id)) {
      let idx = nodeInfo.excludeSpuIds.indexOf(id)
      nodeInfo.excludeSpuIds.splice(idx, 1)
    } else {
      nodeInfo.includeSpuIds.push(id)
    }
  }
  // if (!nodeInfo.includeSpuIds.length && !nodeInfo.excludeSpuIds.length) {
  //   // 删除此节点
  //   unset(checkBoxList, path)
  // }
  resetNodeStatus(parentIdList, checkBoxList)
}

export const resetNodeStatus = (parentIdList, checkBoxList) => {
  for (let i = parentIdList.length; i >= 0; i--) {
    const idList = parentIdList.slice(0, i)
    const path = `${idList.join('.selected') ? idList.join('.selected.') : ''}` // 非叶子结点路径
    if (!path) continue
    const nodeInfo = get(checkBoxList, path)
    if (nodeInfo) {
      if (nodeInfo.leaf) {
        // 是叶子结点根据includeSpuIds和excludeSpuIds判断
        const { includeSpuIds, excludeSpuIds, total } = nodeInfo
        if ((!includeSpuIds.length && !excludeSpuIds.length) || (includeSpuIds.length && includeSpuIds.length >= total)) {
          nodeInfo.checked.value = true
          nodeInfo.checked.indeterminate = false
        } else if ((includeSpuIds.length || excludeSpuIds.length) && (includeSpuIds.length !== total || excludeSpuIds.length !== total)) {
          nodeInfo.checked.value = true
          nodeInfo.checked.indeterminate = true
        } else {
          // 删除此节点
          deleteSelectedNode(checkBoxList, idList.slice(0, i - 1), idList[idList.length - 1])
        }
      } else {
        if (nodeInfo.selected && Object.keys(nodeInfo.selected).length) {
          // 非叶子结点根据下面判断
          const res = Object.values(nodeInfo.selected).reduce((a, b) => {
            a *= getCheckStatus(b.checked)
            return a
          }, 1)
          if (Object.keys(nodeInfo.selected).length === nodeInfo.total) setCheckStatus(checkBoxList, res, nodeInfo)
          else setCheckStatus(checkBoxList, 0.5, nodeInfo)
        } else {
          deleteSelectedNode(checkBoxList, idList.slice(0, i - 1), idList[idList.length - 1])
        }
      }
    }
  }
}

export const isProductSelect = (product, tag, checkBoxList) => {
  const parentIdList = getProductParentNodeList(product, tag)
  const path = parentIdList.join('.selected.')
  const id = product.id
  let nodeInfo = get(checkBoxList, path)
  if (nodeInfo) {
    const { includeSpuIds, excludeSpuIds } = nodeInfo
    const includeLength = includeSpuIds.length
    const excludeLength = excludeSpuIds.length
    if (!includeLength && !excludeLength) return true
    else if (includeLength && !excludeLength) return includeSpuIds.includes(id)
    else if (!includeLength && excludeLength) return !excludeSpuIds.includes(id)
  }
  return false
}
