export const productSelectInTag = (product, tagId, map) => {
  const state = map[tagId]
  if (!state) {
    return false
  }
  const { checked, list } = state
  const include = list.includes(product.id)
  if (checked) {
    return !include
  }
  return include
}

export const getProductState = (product, map, tagIdList) => {
  return tagIdList.some(tagId => productSelectInTag(product, tagId, map))
}

export const toggleStatusProduct = (status, product, tagIdList, map) => {
  const newMap = { ...map }
  tagIdList.forEach((tagId) => {
    const state = map[tagId]
    if (!state) {
      return
    }
    const { checked } = state
    const newList = [...state.list]
    const index = newList.findIndex(id => id === product.id)
    if (checked) {
      if (status && index >= 0) {
        newList.splice(index, 1)
      } else if (!status && index < 0) {
        newList.push(product.id)
      }
    } else {
      if (status && index < 0) {
        newList.push(product.id)
      } else if (!status && index >= 0) {
        newList.splice(index, 1)
      }
    }
    newMap[tagId] = { ...state, list: newList }
  })
  return newMap
}

export const getTagStatus = (tagId, map) => {
  const { list, total, checked } = map[tagId]
  let value = false
  let indeterminate = false
  let count = 0
  const empty = list.length <= 0
  const full = list.length >= total && total > 0
  if (checked) {
    value = empty
    indeterminate = !empty && !full
    count = total - list.length
  } else {
    value = full
    indeterminate = !empty && !full
    count = list.length
  }
  return {
    value,
    indeterminate,
    count
  }
}

export const getAllTagStatus = (map) => {
  let value = true
  let indeterminate = false
  let count = 0
  Object.keys(map).forEach((key) => {
    const tagStatus = getTagStatus(key, map)
    count += tagStatus.count
    if (!tagStatus.value) {
      value = false
    }
  })
  indeterminate = !value && count > 0
  return {
    value,
    indeterminate,
    count
  }
}
