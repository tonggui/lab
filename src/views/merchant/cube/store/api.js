import {
  fetchGetPoiScopeList,
  fetchSubmitMultiCreateRecommendProduct,
  fetchGetMultiRecommendProductList,
  getCubeBatchSaveProduct,
  fetchGetProductMultiCubeTabList,
  fetchGetMultiCubeTagList
} from '@/data/repos/merchantCube'

export default {
  multiCubeList: {
    tab: {
      getList: fetchGetProductMultiCubeTabList
    },
    tag: {
      getList: fetchGetMultiCubeTagList
    },
    product: {
      getList: fetchGetMultiRecommendProductList
    },
    scope: {
      getList: fetchGetPoiScopeList
    }
  },
  multiCubeEdit: {
    batchCreate: getCubeBatchSaveProduct,
    singleCreate: fetchSubmitMultiCreateRecommendProduct
  }
}
