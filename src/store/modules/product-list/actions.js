export default (api) => ({
  async getList ({ state, commit }) {
    try {
      commit('loading', true)
      const result = await api.getList({
        status: state.status,
        tagId: state.tagId,
        sorter: state.sorter
      }, state.pagination, state.statusList)
      commit('statusList', result.statusList)
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
    dispatch('resetPagination')
    dispatch('getList')
  },
  tagIdChange ({ commit }, tagId) {
    commit('tagId', tagId)
  },
  resetTagId ({ commit }) {
    commit('resetTagId')
  },
  resetStatus ({ commit }) {
    commit('resetStatus')
  },
  resetPagination ({ commit }) {
    commit('resetPagination')
  },
  resetSorter ({ commit }) {
    commit('resetSorter')
  },
  reset ({ dispatch }) {
    dispatch('resetStatus')
    dispatch('resetPagination')
    dispatch('resetSorter')
  },
  async batch ({ state }, { type, data, idList }) {
    const productList = state.list.filter(product => idList.includes(product.id))
    try {
      await api.batch(type, data, productList, {
        tagId: state.tagId,
        productStatus: state.status
      })
    } catch (err) {
      console.error(err)
    }
  },
  async delete ({ state }, { product, isCurrentTag }) {
    await api.delete(product, isCurrentTag, {
      productStatus: state.status,
      tagId: state.tagId
    })
  },
  async modify ({ state, dispatch, commit }, { product, params }) {
    await api.modify(product, params, {
      productStatus: state.status,
      tagId: state.tagId
    })
    commit('modify', { ...product, ...params })
    // TODO
    /**
     * 可修改的商品属性 有 上下架、修改名称、修改图片
     * 只有修改上下架 会影响 商品status 所以需要刷新
     */
    if ('sellStatus' in params) {
      dispatch('getList')
    }
  },
  async modifySku ({ commit, dispatch }, { product, sku, params }) {
    await api.modifySku(sku.id, params)
    // TODO
    commit('modifySku', { product, sku: { ...sku, ...params } })
    // TODO
    dispatch('getList')
  }
})
