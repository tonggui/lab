import {
  fetchGetWhiteListModuleMapByCategoryId
} from '@/data/repos/category'

const source = {
  whiteList: {
    fetch: ({ categoryId }) => {
      if (!categoryId) {
        return {}
      }
      return fetchGetWhiteListModuleMapByCategoryId(categoryId)
    },
    defaultValue: {
      propertyLock: false,
      weightRequired: false,
      upcRequired: false,
      pictureContent: false,
      productVideo: false,
      multiTag: false,
      tagSmartSort: false,
      customCreateProduct: false
    }
  }
}

export default source

export const names = Object.keys(source).reduce((prev, name) => {
  prev[name] = name
  return prev
}, {})
