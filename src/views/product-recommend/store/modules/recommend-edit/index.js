// import api from '../../api'
import {
  mergeProduct
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
    setEditProductCache (state, cacheProduct) {
      const currentProduct = state.editProductCache[cacheProduct.__id__] || {}
      let newCacheProduct
      if (currentProduct.skuList) {
        newCacheProduct = mergeProduct(cacheProduct, currentProduct)
      } else {
        newCacheProduct = { ...currentProduct, ...cacheProduct }
      }
      state.editProductCache = {
        ...state.cache,
        [cacheProduct.__id__]: newCacheProduct
      }
    },
    setCreatedProductCount (state, count) {
      state.createdProductCount = count || 0
    }
  },
  actions: {
    modifyProduct ({ commit }, { params, product }) {
      const { __id__ } = product
      commit('setEditProductCache', { __id__, ...params })
    },
    modifySku ({ commit }, { product, sku, params }) {
      const { skuList, __id__ } = product
      const cacheSkuList = skuList.map(s => {
        if (s.__id__ === sku.__id__) {
          return { __id__: s.__id__, ...params }
        }
        return { __id__: s.__id__ }
      })
      commit('setEditProductCache', { __id__, skuList: cacheSkuList })
    },
    resetCreatedProductCount ({ commit }) {
      commit('setCreatedProductCount', 0)
    }
  }
}
