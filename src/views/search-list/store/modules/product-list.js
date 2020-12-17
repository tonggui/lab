import createProductListStore from '@/store/modules/product-list'
import merge from '@/store/helper/merge-module'
import message from '@/store/helper/toast'

const initFilters = {
  keyword: '',
  brandId: '',
  labelIdList: [],
  saleStatus: false,
  limitSale: false,
  packageProduct: 2,
  medicareType: 1,
  stockoutAutoClearStock: false
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
          message.error(err.message)
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
