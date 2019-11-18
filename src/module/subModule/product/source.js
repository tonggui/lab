import {
  fetchGetWhiteList
} from '@/data/repos/common'

const source = {
  whiteList: {
    fetch: ({ categoryId, poiId }) => {
      if (!categoryId) {
        return {}
      }
      return fetchGetWhiteList(poiId, categoryId)
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
