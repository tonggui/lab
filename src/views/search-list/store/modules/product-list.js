import createProductListStore from '@/store/modules/product-list'
import merge from '@/store/helper/merge-module'

const initFilters = {
  keyword: '',
  brandId: '',
  labelIdList: [],
  saleStatus: false
}

export default (api) => {
  const productListStore = createProductListStore(api)
  return merge(productListStore, {
    state: () => {
      return {
        filters: { ...initFilters }
      }
    },
    mutations: {
      setFilters (state, payload) {
        state.filters = {
          ...state.filters,
          ...payload
        }
      }
    },
    actions: {
      async getList ({ commit, state }) {
        try {
          commit('setLoading', true)
          commit('setError', false)
          const result = await api.getList({
            status: state.status,
            tagId: state.tagId,
            sorter: state.sorter,
            ...state.filters
          }, state.pagination, state.statusList)
          commit('setStatusList', result.statusList)
          commit('setList', result.list)
          commit('setPagination', result.pagination)
        } catch (err) {
          console.error(err)
          commit('setError', true)
        } finally {
          commit('setLoading', false)
        }
      },
      changeFilters ({ commit }, filters) {
        commit('setFilters', filters)
      },
      clearFilters ({ commit }) {
        commit('setFilters', { ...initFilters })
      }
    }
  })
}
