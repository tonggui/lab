import {
  fetchGetProductInfoList,
  fetchGetProductListOnSorting,
  fetchSubmitChangeProductSortType,
  fetchSubmitDeleteProduct,
  fetchSubmitModProduct,
  fetchSubmitBatchOperationProduct,
  fetchSubmitToggleProductToTop,
  fetchSubmitUpdateProductSequence,
  fetchSubmitModProductSku
} from '@/data/repos/product'

import {
  fetchGetPoiTagInfo,
  fetchSubmitChangeTagLevel,
  fetchSubmitAddTag,
  fetchSubmitModTag,
  fetchSubmitDeleteTag,
  fetchSubmitToggleTagToTop,
  fetchSubmitUpdateTagSequence,
  fetchSubmitToggleTagSmartSort
} from '@/data/repos/category'

import { fetchSubmitClearRelPoi } from '@/data/repos/medicineMerchantProduct'
import { isAssociateMedicineMerchant } from '@/module/helper/utils'
import store from '@/store'

export default {
  product: {
    getList: fetchGetProductInfoList,
    getSortList: fetchGetProductListOnSorting,
    changeSortType: fetchSubmitChangeProductSortType,
    // delete: fetchSubmitDeleteProduct,
    delete: async (product, isCurrentTag, context) => {
      // 如果门店开通医药商家商品中心 （删除商品 = 取消和商家商品的关联）
      if (await isAssociateMedicineMerchant()) {
        const wmPoiId = store.state.route.query.wmPoiId
        return fetchSubmitClearRelPoi(product.id, [wmPoiId])
      }
      return fetchSubmitDeleteProduct(product, isCurrentTag, context)
    },
    modify: fetchSubmitModProduct,
    batch: fetchSubmitBatchOperationProduct,
    smartSort: fetchSubmitToggleProductToTop,
    dragSort: fetchSubmitUpdateProductSequence,
    modifySku: fetchSubmitModProductSku
  },
  tag: {
    getList: fetchGetPoiTagInfo,
    changeLevel: fetchSubmitChangeTagLevel,
    modify: fetchSubmitModTag,
    add: fetchSubmitAddTag,
    delete: fetchSubmitDeleteTag,
    changeSortType: fetchSubmitToggleTagSmartSort,
    smartSort: ({ tag, sequence }) => fetchSubmitToggleTagToTop(tag.id, tag.isSmartSort, sequence),
    dragSort: ({ sortTagIdList }) => fetchSubmitUpdateTagSequence(sortTagIdList)
  }
}
