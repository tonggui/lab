import { isArray, get } from 'lodash'

export function findTagInfo (data, tagListSource, currentTag, checkBoxList) {
  const product = isArray(data) ? data[0] : data
  const productTagList = get(product.tagList)
  let parentIdList = []
  if (currentTag) {
    parentIdList = [...currentTag.parentIdList, currentTag.id]
  } else {
    parentIdList = [productTagList.parentId, productTagList.id]
  }
  const path = parentIdList.join('.selected.')
  const nodeInfo = get(checkBoxList, path)
  if (nodeInfo === undefined) {
    // TODO 创建
  } else {
    if (nodeInfo.includeSpuIds.includes(data.id)) {
      let idx = nodeInfo.includeSpuIds.indexOf(data.id)
      nodeInfo.includeSpuIds.splice(idx, 1)
    } else if (nodeInfo.excludeSpuIds) {
      let idx = nodeInfo.excludeSpuIds.indexOf(data.id)
      nodeInfo.includeSpuIds.splice(idx, 1)
    }
  }
}
