export const checkDuplicateArrayItem = (items = []) => {
  const item = items.find((i, idx) => {
    const arr = items.slice(idx + 1)
    return arr.some(a => a === i)
  })
  if (item) return `${item}重复出现`
  return null
}

export const validateAttributes = (attrs = []) => {
  const names = attrs.map(attr => attr.name)
  if (names.some(name => !(name && name.trim()))) {
    return '属性名称不能为空'
  }

  let err = checkDuplicateArrayItem(names)
  if (err) return `属性名称不能重复！(${err})`

  for (let i = 0; i < attrs.length; i++) {
    const values = attrs[i].value || []
    const validValueArray = values.filter(val => val && val.trim())
    if (validValueArray.length < 1) return `属性值不能为空！(属性${attrs[i].name}的属性值为空)`
    err = checkDuplicateArrayItem(validValueArray)
    if (err) {
      return `同一属性下，属性值不能重复！(属性${attrs[i].name}中属性值${err})`
    }
  }

  return null
}
