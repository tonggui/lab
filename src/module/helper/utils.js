export const some = (fn, defaultValue = false) => (list) => {
  if (list.length <= 0) {
    return defaultValue
  }
  return list.some(fn)
}
export const every = (fn, defaultValue = false) => (list) => {
  if (list.length <= 0) {
    return defaultValue
  }
  return list.every(fn)
}

export const isMedicineBusiness = category => category.pid === 22 && category.id !== 4012

export const isMedicineAccount = (categoryList, routerTagId) => {
  if (categoryList && categoryList.length > 0) {
    return some(category => isMedicineBusiness(category))(categoryList)
  }
  return (+routerTagId) === 22
}
