import message from '@/store/helper/toast'
import mergeModule from '@/store/helper/merge-module'
import createProductListStore from '@/store/modules/product-list'

const defaultState = {
  statusList: [],
  filters: {
    keyword: '',
    brandId: ''
  }
}

export default (api) => {
  const productListStoreInstance = createProductListStore(api, defaultState)
  return mergeModule(productListStoreInstance, {
    state: { ...defaultState },
    mutations: {
      setFilters (state, payload) {
        state.filters = {
          ...state.filters,
          ...payload
        }
      }
    },
    actions: {
      async getList ({ state, commit }) {
        try {
          commit('setLoading', true)
          commit('setError', false)
          const result = await api.getList({
            ...state.filters,
            tagId: state.tagId
            // keyword: state.filters.keyword,
            // brandId: state.filters.brandId
          }, state.pagination)
          commit('setList', result.list)
          commit('setPagination', result.pagination)
        } catch (err) {
          console.error(err)
          message.error(err.message)
          commit('setError', true)
        } finally {
          commit('setLoading', false)
        }
      },
      changeFilters ({ commit }, filters) {
        commit('setFilters', filters)
      },
      async delete ({ state, dispatch }, { product, params }) {
        await api.delete(product, params)
        // 删除最后一个商品的时候，分页需要往前推一页
        if (state.list.length === 1) {
          dispatch('pagePrev')
        }
      },
      async modifySkuList ({ commit }, { product, skuList, type, params }) {
        await api.modifySkuList(type, product, skuList, params)
        commit('modify', { ...product, skuList })
      }
    }
  })
}
