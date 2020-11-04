import message from '@/store/helper/toast'
import { convertProductSkuList } from '@/data/helper/product/base/convertFromServer'
import { Message } from '@roo-design/roo-vue'

export default (api) => ({
  async getList ({ state, commit, dispatch }, commonParameter = {}) {
    try {
      commit('setLoading', true)
      commit('setError', false)
      const { pageSize, current } = state.pagination
      // console.log(commonParameter)
      const query = {
        // status: state.status,
        // tagId: state.tagId,
        // sorter: state.sorter,
        ...commonParameter,
        pageNo: current,
        pageSize
      }
      const result = await api.getList(query)
      if (commonParameter) {
        // console.log(commonParameter)
        commit('setSearchParams', commonParameter)
      }
      const { totalCount: total } = result
      const resultPagination = {
        total,
        pageSize: result.pageSize
      }
      /**
       * 商品请求的分页数目 溢出当前商品总数 需要重新获取
       */
      if (current > 1 && pageSize * (current - 1) >= total) {
        const newCurrent = Math.ceil(total / pageSize)
        commit('setPagination', {
          ...resultPagination,
          current: newCurrent
        })
        dispatch('getList', state.searchParams)
        return
      }
      const { resultList = [] } = result
      const list = resultList.map((item) => {
        const { wmProductSkus } = item
        item.skuList = convertProductSkuList(wmProductSkus || [])
        return item
      })
      commit('setList', list)
      commit('setPagination', resultPagination)
    } catch (err) {
      console.error(err)
      message.error(err.message)
      commit('setError', true)
    } finally {
      commit('setLoading', false)
    }
  },
  // // 获取页面筛选条件 药品类别 上下架状态
  // async getCondition ({ commit }) {
  //   const result = await api.getCondition()
  //   console.log(result)
  //   commit('setQueryCondition', result)
  // },
  pagePrev ({ commit, state, dispatch }) {
    // console.log('pagePrev')
    const { pagination } = state
    const { current } = pagination
    if (current > 1) {
      commit('setPagination', { ...pagination, current: current - 1 })
      dispatch('getList', state.searchParams)
    }
  },
  pageChange ({ commit, state, dispatch }, pagination) {
    commit('setPagination', pagination)
    dispatch('getList', state.searchParams)
  },
  statusChange ({ commit, dispatch }, status) {
    // commit('setStatus', status)
    dispatch('resetPagination')
  },
  // sorterChange ({ commit, dispatch }, sorter) {
  //   commit('setSorter', sorter)
  //   dispatch('resetPagination')
  // },
  // tagIdChange ({ commit, dispatch }, tagId) {
  //   commit('setTagId', tagId)
  //   dispatch('getList')
  // },
  resetPagination ({ commit, dispatch }) {
    commit('resetPagination')
    // dispatch('getList')
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
    console.log(111111)
    // const context = {
    //   productStatus: state.status,
    //   tagId: state.tagId,
    //   force
    // }
    // await api.delete(product, isCurrentTag, context)
    // // 删除最后一个商品的时候，分页需要往前推一页
    // if (state.list.length === 1) {
    //   dispatch('pagePrev')
    // }
  },
  async modify ({ state, commit }, { product, params }) {
    // console.log(product, params)
    const { wmPoiId, spuId } = product
    const { sellStatus } = params
    await api.modify({ wmPoiId, spuIds: spuId, ...params }).then(() => {
      const desc = sellStatus ? '下架' : '上架'
      commit('modify', { ...product, ...params })
      Message.success(`商品${desc}成功～`)
    }).catch((err) => {
      if (err.message) {
        Message.error(err.message)
      }
    })
  },
  // 修改单个商品价格
  // async modifySkuList ({ commit, dispatch }, { product, skuList, type, params }) {
  //   console.log('action')
  //   await api.modifySkuList(type, product, skuList, params)
  //   // commit('modify', { ...product, skuList })
  //   dispatch('getList')
  // },
  async modifySku ({ commit, state, dispatch }, { product, type, params }) {
    // console.log('modifySku: ', product, type, params)
    const { wmPoiId, skuId } = product
    if (type === 'price') {
      await api.modifySku({ wmPoiId, ...params, skuId }, type)
    } else {
      await api.modifySku({ wmPoiId, ...params, skuIds: skuId }, type)
    }
    // 更新sku
    commit('modifySku', { product, params, type })
    dispatch('getList', state.searchParams)
  }
})
