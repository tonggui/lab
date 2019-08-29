import {
  fetchGetProductInfoList,
  fetchGetProductListOnSorting,
  fetchSubmitModProduct,
  fetchSubmitChangeProductSortType
  // fetchSubmitToggleProductToTop
} from '@/data/repos/product'

export default {
  async getList ({ state, commit }) {
    try {
      commit('loading', true)
      const { list, statusList, pagination } = await fetchGetProductInfoList({
        status: state.status,
        tagId: state.tagId,
        sorter: state.sorter
      }, state.pagination, state.statusList)
      commit('setList', list)
      commit('statusList', statusList)
      commit('pagination', pagination)
      commit('error', false)
    } catch (err) {
      console.error(err)
      commit('error', true)
    } finally {
      commit('loading', false)
    }
  },
  // TODO
  async getSortList ({ state, commit }) {
    try {
      commit('loading', true)
      const { list, pagination, sortInfo } = await fetchGetProductListOnSorting(state.tagId, state.pagination)
      commit('setList', list)
      commit('pagination', pagination)
      commit('sortInfo', sortInfo)
      commit('error', false)
    } catch (err) {
      console.error(err)
      commit('error', true)
    } finally {
      commit('loading', false)
    }
  },
  pageChange ({ commit, dispatch }, pagination) {
    commit('pagination', pagination)
    dispatch('getList')
  },
  statusChange ({ commit, dispatch }, status) {
    commit('status', status)
    commit('resetPagination')
    dispatch('getList')
  },
  sorterChange ({ commit, dispatch }, sorter) {
    commit('sorter', sorter)
    commit('resetPagination')
    dispatch('getList')
  },
  tagIdChange ({ commit }, tagId) {
    commit('tagId', tagId)
    commit('resetPagination')
  },
  // async  ({ commit, state }, {  }) {

  // },
  async toggleSmartSort ({ commit, state }, smartSort) {
    try {
      commit('loading', true)
      await fetchSubmitChangeProductSortType(smartSort, state.sortInfo.topCount, state.tagId)
      commit('smartSort', !!smartSort)
    } catch (err) {
      console.error(err)
    } finally {
      commit('loading', false)
    }
  },
  async batch ({ state, dispatch }, { type, data, idList }) {
    const skuIdList = []
    idList.forEach((id) => {
      const product = state.list.find(item => item.id === id)
      if (product) {
        product.skuList.forEach(sku => skuIdList.push(sku.id))
      }
    })
    try {
      await fetchSubmitModProduct(type, data, {
        tagId: state.tagId,
        spuIdList: idList,
        skuIdList,
        productStatus: state.status
      })
      dispatch('getList')
    } catch (err) {
      console.error(err)
    }
  }
}
