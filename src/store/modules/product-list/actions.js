export default (api) => ({
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
          sorter: state.sorter
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
  tagIdChange ({ commit, dispatch }, tagId) {
    commit('tagId', tagId)
    commit('resetPagination')
    dispatch('getList')
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
  },
  async batch ({ state, dispatch }, { type, data, idList }) {
    const productList = state.list.filter(product => idList.includes(product.id))
    try {
      await api.batch(type, data, productList, {
        tagId: state.tagId,
        productStatus: state.status
      })
      dispatch('getList')
    } catch (err) {
      console.error(err)
    }
  },
  async delete ({ state, dispatch }, { product, isCurrentTag }) {
    await api.delete(product, isCurrentTag, {
      productStatus: state.status,
      tagId: state.tagId
    })
    dispatch('getList')
  },
  async modify ({ state, dispatch }, { product, params }) {
    await api.modify(product, params, {
      productStatus: state.status,
      tagId: state.tagId
    })
    dispatch('getList')
  },
  async modifySku ({ dispatch }, { sku, params }) {
    await api.modifySku(sku.id, params)
    dispatch('getList')
  }
})
