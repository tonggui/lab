import {
  fetchGetWhiteListModuleMapByCategoryId
} from '@/data/repos/category'
import {
  fetchGetWhiteListModuleMapByCategoryId as fetchGetMerchantWhiteListModuleMapByCategoryId
} from '@/data/repos/merchantCategory'

const source = {
  whiteList: {
    fetch: ({ categoryId, merchant }) => {
      console.log('something changed', categoryId, merchant)
      if (!categoryId) {
        return {}
      }
      if (merchant) {
        return fetchGetMerchantWhiteListModuleMapByCategoryId(categoryId)
      } else {
        return fetchGetWhiteListModuleMapByCategoryId(categoryId)
      }
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
