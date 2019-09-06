import createProductListStore from '@/store/modules/product-list'
import merge from '@/store/modules/helper/merge-module'

export default (api) => {
  const productStore = createProductListStore(api)
  return merge(productStore, {
    state: {
      sorting: false,
      sortInfo: {
        isSmartSort: false,
        topCount: 0
      }
    },
    getters: {
      isSmartSort (state) {
        return state.sortInfo.isSmartSort
      }
    },
    mutations: {
      sorting (state, payload) {
        state.sorting = payload
      },
      sortInfo (state, payload) {
        state.sortInfo = {
          ...state.sortInfo,
          ...payload
        }
      },
      smartSort (state, payload) {
        state.sortInfo.isSmartSort = !!payload
      }
    },
    actions: {
      async getList ({ state, commit }) {
        try {
          commit('loading', true)
          let result
          if (state.sorting) {
            result = await api.getSortList(state.tagId, state.pagination)
            commit('sortInfo', result.sortInfo)
          } else {
            result = await api.getList({
              status: state.status,
              tagId: state.tagId,
              sorter: state.sorter,
              keyword: state.keyword
            }, state.pagination, state.statusList)
            commit('statusList', result.statusList)
          }
          commit('setList', result.list)
          commit('pagination', result.pagination)
          commit('error', false)
        } catch (err) {
          console.error(err)
          commit('error', true)
        } finally {
          commit('loading', false)
        }
      },
      async sort ({ commit, state }, { productList, product }) {
        const isSmartSort = state.sortInfo.isSmartSort
        let sequence
        const query = { tagId: state.tagId }
        if (isSmartSort) {
          const smartProductList = productList.filter(item => item.isSmartSort)
          sequence = smartProductList.length - 1
          if (product.isSmartSort) {
            sequence = smartProductList.findIndex(item => item.id === product.id)
          }
          await api.smartSort(product.id, sequence, product.isSmartSort, query)
        } else {
          sequence = productList.findIndex(p => p.id === product.id)
          await api.dragSort(product.id, sequence, query)
        }
        commit('setList', productList)
      },
      async toggleSmartSort ({ commit, state }, smartSort) {
        try {
          commit('loading', true)
          await api.changeSortType(smartSort, state.sortInfo.topCount, state.tagId)
          commit('smartSort', !!smartSort)
        } catch (err) {
          console.error(err)
        } finally {
          commit('loading', false)
        }
      }
    }
  })
}
