import Vue from 'vue'

export default Vue.observable({
  sortTagList: [], // taglist排序
  sortProduct: {}, // 商品排序
  isEmptyTag: false, // 门店是否没有分类
  poiProductCount: 0 // 门店商品总数
})
