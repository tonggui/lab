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

const getInitState = () => ({
  loading: false,
  error: false,
  list: [],
  pagination: { ...defaultPagination },
  keyword: '',
  cache: {},
  spuId: '',
  awardInfo: {}
})

export default (api) => ({
  state () {
    return getInitState()
  },
  mutations: {
    init (state, { spuId, awardInfo }) {
      state.spuId = spuId
      state.awardInfo = awardInfo
    },
    destory (state) {
      Object.assign(state, getInitState())
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
    },
    modifySku ({ commit }, { product, sku, params }) {
      const { skuList, __id__ } = product
      const cacheSkuList = skuList.map(s => ({ __id__: s.__id__ }))
      const index = cacheSkuList.findIndex(s => s.__id__ === sku.__id__)
      const cacheSku = cacheSkuList[index]
      cacheSkuList.splice(index, 1, { ...cacheSku, ...params })
      commit('setCache', { __id__, skuList: cacheSkuList })
    },
    async putOn ({ state }, product) {
      await api.putOn(product)
    },
    delete ({ state, commit, dispatch }, product) {
      if (state.list.length <= 1 && state.pagination.current > 1) {
        commit('setPagination', { current: state.pagination.current - 1 })
      }
      commit('deleteCache', product)
      dispatch('getList')
    }
  }
})
