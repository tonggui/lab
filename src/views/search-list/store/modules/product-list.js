import createProductListStore from '@/store/modules/product-list'
import merge from '@/store/modules/helper/merge-module'

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
      filters (state, payload) {
        state.filters = {
          ...state.filters,
          ...payload
        }
      }
    },
    actions: {
      async getList ({ commit, state }) {
        try {
          commit('loading', true)
          commit('error', false)
          const result = await api.getList({
            status: state.status,
            tagId: state.tagId,
            sorter: state.sorter,
            ...state.filters
          }, state.pagination, state.statusList)
          commit('statusList', result.statusList)
          commit('setList', result.list)
          commit('pagination', result.pagination)
        } catch (err) {
          console.error(err)
          commit('error', true)
        } finally {
          commit('loading', false)
        }
      },
      changeFilters ({ commit }, filters) {
        commit('filters', filters)
      },
      clearFilters ({ commit }) {
        commit('filters', { ...initFilters })
      }
    }
  })
}
