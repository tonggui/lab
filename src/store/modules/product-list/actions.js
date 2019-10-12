export default (api) => ({
  async getList ({ state, commit, dispatch }) {
    try {
      commit('loading', true)
      const result = await api.getList({
        status: state.status,
        tagId: state.tagId,
        sorter: state.sorter
      }, state.pagination, state.statusList)
      const { pageSize, current } = state.pagination
      const { total } = result.pagination
      /**
       * 商品请求的分页数目 溢出当前商品总数 需要重新获取
       */
      if (pageSize * (current - 1) <= total) {
        const newCurrent = Math.ceil(total / pageSize)
        commit('pagination', {
          ...result.pagination,
          current: newCurrent
        })
        dispatch('getList')
        return
      }
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
  pagePrev ({ commit, state }) {
    const { pagination } = state
    const { current } = pagination
    if (current > 1) {
      commit('pagination', { ...pagination, current: current - 1 })
    }
  },
  pageChange ({ commit, dispatch }, pagination) {
    commit('pagination', pagination)
    dispatch('getList')
  },
  statusChange ({ commit, dispatch }, status) {
    commit('status', status)
    dispatch('resetPagination')
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
    await api.batch(type, data, productList, {
      tagId: state.tagId,
      productStatus: state.status
    })
  },
  async delete ({ state, dispatch }, { product, isCurrentTag }) {
    await api.delete(product, isCurrentTag, {
      productStatus: state.status,
      tagId: state.tagId
    })
    // 删除最后一个商品的时候，分页需要往前推一页
    if (state.list.length === 1) {
      dispatch('pagePrev')
    }
  },
  async modify ({ state, commit }, { product, params }) {
    await api.modify(product, params, {
      productStatus: state.status,
      tagId: state.tagId
    })
    commit('modify', { ...product, ...params })
  },
  async modifySku ({ commit, dispatch }, { product, sku, params }) {
    await api.modifySku(sku.id, params)
    commit('modifySku', { product, sku: { ...sku, ...params } })
    dispatch('getList')
  }
})
