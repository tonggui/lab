import httpClient from '../client/instance/merchant'
import {
  convertTagWithSortList as convertTagWithSortListFromServer,
} from '../helper/category/convertFromServer'

export const getTagList = () => httpClient.post('/hqcc/r/tagList').then(data => {
  const {
    tagList,
    smartSortSwitch,
    tagToTopLimit,
    totalCount,
  } = (data || {}) as any
  return {
    tagList: convertTagWithSortListFromServer(tagList),
    tagInfo: {
      smartSortSwitch: !!smartSortSwitch,
      topLimit: tagToTopLimit || 0,
      productTotal: totalCount,
    }
  }
})
