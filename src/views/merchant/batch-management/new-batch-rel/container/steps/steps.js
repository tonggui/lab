export const STEPS = {
  'PRODUCT': 0,
  'POI': 1,
  'RELATE': 2,
  'FINISH': 3
}
const convertProductData = (data, result = []) => {
  Object.entries(data).forEach(([key, node]) => {
    if (node.leaf) {
      result.push({
        tagId: key,
        includeSpuIds: node.includeSpuIds,
        excludeSpuIds: node.excludeSpuIds,
        leaf: node.leaf
      })
    } else convertProductData(node.selected, result)
  })
  return result
}

// https://km.sankuai.com/page/673188230
export const transferDataToServer = (data) => {
  console.log('data', data)
  const params = {}
  const {
    dataSourceType, productSelect, productData, dataSourceValues, syncType, poiList, batchType
  } = data

  if (dataSourceType === 'all' || dataSourceType === 'parts') {
    params.dataSourceType = 1
  }
  if (productSelect === 'category') {
    params.syncTagList = convertProductData(productData)
  } else if (productSelect === 'batch') {
    params.dataSourceType = batchType // 3,4,5
    params.dataSourceValues = dataSourceValues
  }
  if (syncType === 'all') {
    params.syncType = 1
  } else if (syncType === 'exclude') {
    params.syncType = 1
    params.excludeSyncContent = [8, 9]
  } else {
    params.syncType = 10
  }
  params.wmPoiIds = poiList
  console.log('parmas', params)
  return params
}
