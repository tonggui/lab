import createTagListStore from './modules/tag-list'
import createProductListStore from './modules/product-list'
import mergeModule from '@/store/helper/merge-module'
import classifySelectedProductStore from './modules/classify-selected-product'
import api from './api'
import store from '@/store'

const tagListStoreInstance = createTagListStore(api.tag)
const recommendProductListInstance = createProductListStore(api.product)

store.subscribeAction({
  after: (action, _state) => {
    switch (action.type) {
      case 'productRecommend/tagList/select':
        store.dispatch('productRecommend/product/getList', { tagId: action.payload })
        break
    }
  }
})

export default mergeModule({
  namespaced: true,
  state: {
    filters: {
      keyword: '',
      isProductVisible: true
    },
    editCache: {}
  },
  getters: {
    editProductGroupList (state) {
      // TODO 顺序问题
      console.log('editProductGroupList:', Object.entries(state.classifySelectedProducts))
      return Object.entries(state.classifySelectedProducts).map(([key, value], index) => {
        return { id: index, name: key, data: value || [] }
      })
    }
  },
  mutations: {
    setKeyWord (state, filters) {
      Object.assign(state.filters, filters)
    },
    setEditCache (state, product) {
      const currentCacheProduct = state.editCache[product.__id__] || {}
      let newSkuList = currentCacheProduct.skuList
      if (product.skuList) {
        const editSkuListMap = product.skuList.reduce((prev, next) => {
          prev[next.__id__] = next
          return prev
        }, {})
        newSkuList = newSkuList.map(sku => {
          const cacheSku = editSkuListMap[sku.__id__] || {}
          return { ...sku, ...cacheSku }
        })
      }
      const newCacheProduct = { ...currentCacheProduct, ...product, skuList: newSkuList }
      state.editCache = {
        ...state.cache,
        [product.__id__]: newCacheProduct
      }
    }
  },
  actions: {
    getTagList ({ dispatch, state }) {
      dispatch('tagList/getList', state.filters)
    },
    getProductList ({ dispatch, state }) {
      dispatch('product/getList', state.filters)
    },
    getData ({ dispatch, commit }, filters = {}) {
      commit('setKeyWord', filters)
      dispatch('getTagList')
      dispatch('getProductList')
    },
    modifyProduct ({ commit }, { params, product }) {
      const { __id__ } = product
      commit('setEditCache', { __id__, ...params })
    },
    modifySku ({ commit }, { product, sku, params }) {
      const { skuList, __id__ } = product
      const cacheSkuList = skuList.map(s => {
        if (s.__id__ === sku.__id__) {
          return { __id__: s.__id__, ...params }
        }
        return { __id__: s.__id__ }
      })
      commit('setEditCache', { __id__, skuList: cacheSkuList })
    }
  },
  modules: {
    tagList: {
      namespaced: true,
      ...tagListStoreInstance
    },
    product: {
      namespaced: true,
      ...recommendProductListInstance
    }
  }
}, classifySelectedProductStore)
