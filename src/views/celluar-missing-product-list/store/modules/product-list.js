import { defaultPagination } from '@/data/constants/common'

const mergeProduct = (product, cacheProduct) => {
  // 需要处理sku的修改
  if ('skuList' in cacheProduct) {
    const cacheSkuList = cacheProduct.skuList
    const newSkuList = product.skuList
    let skuList = newSkuList
    if (cacheSkuList) {
      skuList = newSkuList.map(sku => {
        const cacheSku = cacheSkuList.find(s => s.__id__ === sku.__id__)
        return { ...sku, ...cacheSku }
      })
    }
    return { ...product, ...cacheProduct, skuList }
  }
  return { ...product, ...cacheProduct }
}

export default (api) => ({
  state () {
    return {
      loading: false,
      error: false,
      list: [],
      pagination: { ...defaultPagination },
      keyword: '',
      cache: {},
      spuId: '',
      awardInfo: {}
    }
  },
  mutations: {
    init (state, { spuId, awardInfo }) {
      state.spuId = spuId
      state.awardInfo = awardInfo
    },
    setLoading (state, loading) {
      state.loading = !!loading
    },
    setError (state, error) {
      state.error = !!error
    },
    setList (state, list) {
      state.list = list || []
    },
    setPagination (state, pagination) {
      state.pagination = {
        ...state.pagination,
        ...pagination
      }
    },
    setKeyword (state, keyword) {
      state.keyword = keyword || ''
    },
    setCache (state, product) {
      const cacheProduct = state.cache[product.__id__] || {}
      let newCacheProduct
      if (cacheProduct.skuList) {
        newCacheProduct = mergeProduct(cacheProduct, product)
      } else {
        newCacheProduct = { ...cacheProduct, ...product }
      }
      state.cache = {
        ...state.cache,
        [product.__id__]: newCacheProduct
      }
      // state.cache[product.__id__] = newCacheProduct
    },
    deleteCache (state, product) {
      state.cache[product.__id__] = {}
    },
    modify (state, product) {
      const index = state.list.findIndex(p => p.__id__ === product.__id__)
      if (index < 0) {
        return state
      }
      state.list.splice(index, 1, product)
    },
    // TODO 优化
    modifySku (state, { product, sku }) {
      const skuIndex = product.skuList.findIndex(s => s.id === sku.id)
      if (skuIndex < 0) {
        return state
      }
      const skuList = [...product.skuList]
      skuList.splice(skuIndex, 1, sku)
      const newProduct = { ...product, skuList }
      const index = state.list.findIndex(p => p.__id__ === product.__id__)
      if (index < 0) {
        return state
      }
      state.list.splice(index, 1, newProduct)
    }
  },
  actions: {
    async getList ({ state, commit }) {
      try {
        commit('setLoading', true)
        commit('setError', false)
        const { keyword, pagination, cache } = state
        const { list, pagination: newPagination } = await api.getList({ keyword }, pagination, state.spuId, state.awardInfo)
        const newList = list.map(product => {
          const cacheProduct = cache[product.__id__] || {}
          return mergeProduct(product, cacheProduct)
        })
        commit('setList', newList)
        commit('setPagination', newPagination)
      } catch (err) {
        console.error(err)
        commit('setError', true)
      } finally {
        commit('setLoading', false)
      }
    },
    changePage ({ commit, dispatch }, pagination) {
      commit('setPagination', pagination)
      dispatch('getList')
    },
    search ({ commit, dispatch }, keyword) {
      commit('setKeyword', keyword)
      commit('setPagination', { current: 1 })
      dispatch('getList')
    },
    modify ({ commit }, { product, params }) {
      const { __id__ } = product
      commit('setCache', { __id__, ...params })
      // commit('modify', { ...product, ...params })
    },
    // TODO 尽一步优化
    modifySku ({ commit }, { product, sku, params }) {
      const { skuList, __id__ } = product
      const cacheSkuList = skuList.map(s => ({ __id__: s.__id__ }))
      const index = cacheSkuList.findIndex(s => s.__id__ === sku.__id__)
      const cacheSku = cacheSkuList[index]
      cacheSkuList.splice(index, 1, { ...cacheSku, ...params })
      // commit('modifySku', { product, sku: { ...sku, ...params } })
      commit('setCache', { __id__, skuList: cacheSkuList })
    },
    async putOn ({ state, commit }, product) {
      // TODO 已经删除/上架成功的 清除缓存
      await api.putOn(product, state.spuId)
      commit('deleteCache', product)
    }
  }
})
