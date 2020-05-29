// import api from '../../api'
import {
  arrayToMap,
  arrayMergeWithMap
} from '../../../utils'

export default {
  namespace: true,
  state: {
    editProductInfoMap: {}, // 编辑的商品信息map: { [product.__id__]: product }
    editProductCache: {}, // 商品编辑缓存
    createdProductCount: 0 // 已创建商品个数
  },
  mutations: {
    // 设置商品修改 缓存
    setEditProductCache (state, product) {
      const currentCacheProduct = state.editProductCache[product.__id__] || {}
      let newSkuList = currentCacheProduct.skuList
      if (product.skuList) {
        const editSkuListMap = arrayToMap(product.skuList)
        newSkuList = arrayMergeWithMap(product.skuList, editSkuListMap)
      }
      const newCacheProduct = { ...currentCacheProduct, ...product, skuList: newSkuList }
      state.editCache = {
        ...state.cache,
        [product.__id__]: newCacheProduct
      }
    },
    setCreatedProductCount (state, count) {
      state.createdProductCount = count || 0
    }
  },
  actions: {
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
    },
    resetCreatedProductCount ({ commit }) {
      commit('setCreatedProductCount', 0)
    }
  }
}
