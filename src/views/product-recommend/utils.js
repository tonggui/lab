/**
 * 选择的商品分类map转化为已选商品列表
 */
export function objToArray (obj) {
  return Object.values(obj).reduce((a, b) => { a.push(...b.productList); return a }, [])
}

export const covertObjectToSequenceArr = (obj) => {
  return Object.entries(obj).sort(
    (a, b) => a[1].sequence - b[1].sequence)
}

export const isEmptyArray = (array) => !array || array.length === 0

export const arrayToMap = (list) => {
  return list.reduce((prev, item) => {
    prev[item.__id__] = item
    return prev
  }, {})
}

export const arrayMergeWithMap = (list, map) => {
  return list.map(item => {
    const cache = map[item.__id__] || {}
    return { ...item, ...cache }
  })
}

export const getPriorityTag = (tagList) => {
  let priorityTag = null
  tagList.forEach(tag => {
    if (!priorityTag || tag.sequence < priorityTag.sequence) {
      priorityTag = tag
    }
  })
  return priorityTag
}

export const getIndex = (list, item) => {
  return list.findIndex(i => {
    return i.__id__ === item.__id__
  })
}

export const arrayUniquePush = (list, item) => {
  const index = getIndex(list, item)
  if (index < 0) {
    list.push(item)
  }
  return list
}

export const arrayUniquePop = (list, item) => {
  const index = getIndex(list, item)
  if (index >= 0) {
    list.splice(index, 1)
  }
  return list
}
