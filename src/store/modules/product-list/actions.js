import message from '@/store/helper/toast'

export default (api) => ({
  async getList ({ state, commit, dispatch }, param) {
    try {
      commit('setLoading', true)
      commit('setError', false)
      const query = {
        status: state.status,
        tagId: state.tagId,
        sorter: state.sorter,
        ...param
      }
      console.log('青丘之', state.status)
      const result = await api.getList(query, state.pagination, state.statusList)
      console.log('返回值', result)
      const { pageSize, current } = state.pagination
      const { total } = result.pagination
      /**
       * 商品请求的分页数目 溢出当前商品总数 需要重新获取
       */
      if (current > 1 && pageSize * (current - 1) >= total) {
        const newCurrent = Math.ceil(total / pageSize)
        commit('setPagination', {
          ...result.pagination,
          current: newCurrent
        })
        dispatch('getList')
        return
      }
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
  pagePrev ({ commit, state }) {
    const { pagination } = state
    const { current } = pagination
    if (current > 1) {
      commit('setPagination', { ...pagination, current: current - 1 })
    }
  },
  pageChange ({ commit, dispatch }, pagination) {
    commit('setPagination', pagination)
    dispatch('getList')
  },
  statusChange ({ commit, dispatch }, status) {
    commit('setStatus', status)
    dispatch('resetPagination')
  },
  sorterChange ({ commit, dispatch }, sorter) {
    commit('setSorter', sorter)
    dispatch('resetPagination')
  },
  tagIdChange ({ commit, dispatch }, tagId) {
    commit('setTagId', tagId)
    dispatch('getList')
  },
  resetPagination ({ commit, dispatch }) {
    commit('resetPagination')
    dispatch('getList')
  },
  destroy ({ commit }) {
    commit('destroy')
  },
  async batch ({ state }, { type, data, idList, force }) {
    const productList = state.list.filter(product => idList.includes(product.id))
    const context = {
      tagId: state.tagId,
      productStatus: state.status,
      force
    }
    const response = await api.batch(type, data, productList, context)
    return response
  },
  async delete ({ state, dispatch }, { product, isCurrentTag, force }) {
    const context = {
      productStatus: state.status,
      tagId: state.tagId,
      force
    }
    await api.delete(product, isCurrentTag, context)
    // 删除最后一个商品的时候，分页需要往前推一页
    if (state.list.length === 1) {
      dispatch('pagePrev')
    }
  },
  async modify ({ state, commit }, { product, params }) {
    const context = {
      productStatus: state.status,
      tagId: state.tagId
    }
    await api.modify(product, params, context)
    commit('modify', { ...product, ...params })
  },
  async modifySku ({ commit, dispatch }, { product, sku, params }) {
    await api.modifySku(sku.id, params)
    commit('modifySku', { product, sku: { ...sku, ...params } })
    if (product.skuList.length <= 1) {
      dispatch('getList')
    }
  }
})
