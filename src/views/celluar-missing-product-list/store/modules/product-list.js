import { defaultPagination } from '@/data/constants/common'

const mergeProduct = (product, cacheProduct) => {
  const skuList = product.skuList
  let newSkuList = skuList

  // 需要处理sku的修改
  if (cacheProduct && cacheProduct.skuList) {
    const cacheSkuListMap = cacheProduct.skuList.reduce((prev, next) => {
      prev[next.__id__] = next
      return prev
    }, {})
    newSkuList = skuList.map(sku => {
      const cacheSku = cacheSkuListMap[sku.__id__] || {}
      return { ...sku, ...cacheSku }
    })
  }
  return { ...product, ...cacheProduct, skuList: newSkuList }
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
      const cacheSkuList = skuList.map(s => {
        if (s.__id__ === sku.__id__) {
          return { __id__: s.__id__, ...params }
        }
        return { __id__: s.__id__ }
      })
      commit('setCache', { __id__, skuList: cacheSkuList })
    },
    putOn (_context, product) {
      return api.putOn(product)
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
