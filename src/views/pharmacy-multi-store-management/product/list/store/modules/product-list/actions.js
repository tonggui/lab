import message from '@/store/helper/toast'
import { convertProductSkuList } from '@/data/helper/product/base/convertFromServer'
import { Message } from '@roo-design/roo-vue'
import { PACKAGE_PRODUCT_OPT_STATUS } from '@/data/enums/product'

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
      if (current * pageSize > 10000) {
        message.error('查询数据量过大，无法查看~')
        return
      }
      commit('setSearchParamsBefore', commonParameter)
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
      const { resultList } = result
      let list = []
      if (resultList === null) {
        list = []
        commit('setList', list)
        return
      }
      list = resultList.map((item) => {
        const { wmProductSkus } = item
        item.skuList = convertProductSkuList(wmProductSkus || [])
        return item
      })
      commit('setList', list)
      commit('setPagination', resultPagination)
    } catch (err) {
      console.error(err)
      if (err.code === -1 && err.message) {
        message.error(err.message)
      } else {
        message.error('系统异常~')
      }
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
    } else {
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
  async delete ({ state, dispatch }, { product, packageConfirmFlag, callback }) {
    console.log('actions.js =>', 'packageConfirmFlag:', packageConfirmFlag, 'callback:', callback)
    const { wmPoiId, skuId } = product
    console.log('单个商品删除 -> wmPoiId:', wmPoiId, 'skuIds:', skuId + '')
    await api.delete({ wmPoiId, skuIds: skuId + '', packageConfirmFlag }).then(async () => {
      // Message.success(`商品删除成功～`)
      // 删除最后一个商品的时候，分页需要往前推一页
      // if (state.list.length === 1) {
      //   dispatch('pagePrev')
      // } else {
      //   dispatch('getList', state.searchParams)
      // }
      await dispatch('resetPagination')
      dispatch('getList', state.searchParams)
    }).catch((err) => {
      // if (err.message) {
      //   Message.error(err.message)
      // }
      // 单个商品删除涉及组包时code:8302
      if (err.code === PACKAGE_PRODUCT_OPT_STATUS.DELETE_CONFIRM && callback) {
        callback(err)
      } else {
        Message.error(err.message || '商品删除失败～')
      }
    })
  },
  async modify ({ state, commit }, { product, sellStatus, packageConfirmFlag, callback }) {
    // console.log(product, params)
    const { wmPoiId, spuId, skuId } = product
    console.log('单个商品上下架 -> wmPoiId:', wmPoiId, 'spuIds:', spuId + '', 'skuIds:', skuId + '', 'sellstatus:', sellStatus, 'packageConfirmFlag:', packageConfirmFlag)
    const desc = sellStatus ? '下架' : '上架'
    await api.modify({ wmPoiId, spuIds: spuId + '', skuIds: skuId + '', sellstatus: sellStatus, packageConfirmFlag }).then(() => {
      commit('modify', { ...product, sellStatus })
      Message.success(`商品${desc}成功～`)
    }).catch((err) => {
      if (err.code === PACKAGE_PRODUCT_OPT_STATUS.SELL_STATUS_OFF_CONFIRM) {
        callback(err)
      } else {
        Message.error(err.message || `商品${desc}失败～`)
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
      console.log('单个商品修改价格 -> wmPoiId:', wmPoiId, 'skuId:', skuId + '', 'price:', parseFloat(params.price))
      await api.modifySku({ wmPoiId, price: parseFloat(params.price), skuId: skuId + '' }, type)
    } else {
      console.log('单个商品修改库存 -> wmPoiId:', wmPoiId, 'skuIds:', skuId + '', 'stock:', params.stock + '')
      await api.modifySku({ wmPoiId, stock: params.stock + '', skuIds: skuId + '' }, type)
    }
    // 更新sku
    commit('modifySku', { product, params, type })
    dispatch('getList', state.searchParams)
  }
})
