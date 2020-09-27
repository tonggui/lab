import api from '../../api'
import {
  mergeProduct,
  getUniqueId
} from '../../../utils'

const getNewProduct = (product, cacheProduct) => {
  const currentProduct = product || {}
  let newCacheProduct
  if (currentProduct.skuList) {
    newCacheProduct = mergeProduct(currentProduct, cacheProduct)
  } else {
    newCacheProduct = { ...currentProduct, ...cacheProduct }
  }
  return newCacheProduct
}

export default {
  namespace: true,
  state: {
    editProductInfoMap: {}, // 编辑的商品信息map: { [product.__id__]: product }
    editProductCache: {}, // 商品编辑缓存
    editProductDefaultValueCache: {},
    createdProductCount: 0 // 已创建商品个数
  },
  mutations: {
    // 设置商品修改 缓存
    setEditProductCache (state, cacheProduct) {
      const id = getUniqueId(cacheProduct)
      const currentProduct = state.editProductCache[id] || {}
      const newCacheProduct = getNewProduct(currentProduct, cacheProduct)
      state.editProductCache = {
        ...state.editProductCache,
        [id]: newCacheProduct
      }
    },
    setEditProductDefaultValueCache (state, cacheProduct) {
      const id = getUniqueId(cacheProduct)
      const currentProduct = state.editProductDefaultValueCache[id] || {}
      const newCacheProduct = getNewProduct(currentProduct, cacheProduct)
      state.editProductDefaultValueCache = {
        ...state.editProductDefaultValueCache,
        [id]: newCacheProduct
      }
    },
    setCreatedProductCount (state, count) {
      state.createdProductCount = count || 0
    },
    setEditProductInfoMap (state, map) {
      state.editProductInfoMap = map || {}
    },
    destroy (state) {
      state.editProductInfoMap = {}
      state.editProductDefaultValueCache = {}
    }
  },
  actions: {
    modifyProduct ({ commit }, { params, product }) {
      const { __id__ } = product
      commit('setEditProductCache', { __id__, ...params })
    },
    modifySku ({ commit }, { product, sku, params, isDefaultValue }) {
      const { skuList, __id__ } = product
      const cacheSkuList = skuList.map(s => {
        if (s.__id__ === sku.__id__) {
          return { __id__: s.__id__, ...params }
        }
        return { __id__: s.__id__ }
      })
      if (isDefaultValue) {
        commit('setEditProductDefaultValueCache', { __id__, skuList: cacheSkuList })
      } else {
        commit('setEditProductCache', { __id__, skuList: cacheSkuList })
      }
    },
    resetCreatedProductCount ({ commit }) {
      commit('setCreatedProductCount', 0)
    },
    async singleCreate ({ commit, state }, product) {
      const error = await api.recommendEdit.singleCreate(product)
      if (!error) {
        commit('setCreatedProductCount', state.createdProductCount + 1)
      }
      return error
    },
    async batchCreate ({ commit, state }, productList) {
      const errorProductList = await api.recommendEdit.batchCreate(productList)
      const successCount = productList.length - errorProductList.length
      const createdProductCount = state.createdProductCount + successCount
      commit('setCreatedProductCount', createdProductCount)
      return errorProductList.reduce((prev, { product, code, message }) => {
        const id = getUniqueId(product)
        prev[id] = { code, message }
        return prev
      }, {})
    },
    destroy ({ commit }) {
      commit('destroy')
    }
  }
}
