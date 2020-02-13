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
  const empty = list.length <= 0
  const full = list.length >= total
  if (checked) {
    value = empty
    indeterminate = !empty && !full
  } else {
    value = full
    indeterminate = !empty && !full
  }
  return {
    value,
    indeterminate
  }
}

export const getAllTagStatus = (map) => {
  let value = false
  let indeterminate = false
  Object.keys(map).forEach((key) => {
    const tagStatus = getTagStatus(key, map)
    if (tagStatus.indeterminate || tagStatus.value) {
      indeterminate = true
    }
    if (!tagStatus.value) {
      value = false
    }
  })
  return {
    value,
    indeterminate: value ? false : indeterminate
  }
}
