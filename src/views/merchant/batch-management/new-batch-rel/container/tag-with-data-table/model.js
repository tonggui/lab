import { isArray, get } from 'lodash'
import { setNodeInfo } from '@/components/tag-tree-with-checkbox/model'

export function findTagInfo (data, tagListSource, currentTag, checkBoxList) {
  const product = isArray(data) ? data[0] : data
  const productTagList = get(product, 'tagList')
  const productTag = isArray(productTagList) ? productTagList[0] : productTagList
  console.log('productTagList', productTagList)
  let parentIdList = []
  if (currentTag) {
    parentIdList = [...currentTag.parentIdList, currentTag.id]
  } else {
    parentIdList = [productTag.parentId, productTag.id]
  }
  const path = parentIdList.join('.selected.')
  let nodeInfo = get(checkBoxList, path)
  if (nodeInfo === undefined) {
    // TODO 创建
    let item = tagListSource
    let i = 0
    for (; i < parentIdList.length - 1; i++) {
      console.log('item-itemitemitem', item)
      item = item.find(it => it.id === parentIdList[i]).children
    }
    item = item.find(it => it.id === parentIdList[i])
    console.log('checkBoxList, item, tagListSource', checkBoxList, item, tagListSource)
    setNodeInfo(checkBoxList, item, tagListSource)
    nodeInfo = get(checkBoxList, path)
    nodeInfo.includeSpuIds.push(product.id)
  } else {
    if (nodeInfo.includeSpuIds.includes(data.id)) {
      let idx = nodeInfo.includeSpuIds.indexOf(data.id)
      nodeInfo.includeSpuIds.splice(idx, 1)
    } else if (nodeInfo.excludeSpuIds) {
      let idx = nodeInfo.excludeSpuIds.indexOf(data.id)
      nodeInfo.includeSpuIds.splice(idx, 1)
    }
  }
  changeNodeStatus(parentIdList, checkBoxList)
}

export const changeNodeStatus = (parentIdList, checkBoxList) => {
  for (let i = parentIdList.length; i >= 0; i--) {
    const path = `${parentIdList.slice(0, i).join('.selected') ? parentIdList.slice(0, i).join('.selected.') : ''}` // 非叶子结点路径
    if (!path) continue
    const nodeInfo = get(this.checkBox, path)
    if (nodeInfo && !nodeInfo.leaf) {
      if (nodeInfo.selected) {
        const res = Object.values(nodeInfo.selected).reduce((a, b) => {
          a *= this.getCheckStatus(b.checked)
          return a
        }, 1)
        if (Object.keys(nodeInfo.selected).length === nodeInfo.total) this.setCheckStatus(res, nodeInfo)
        else this.setCheckStatus(0.5, nodeInfo)
      } else {
        delete this.checkBox[path]
      }
    }
  }
}
