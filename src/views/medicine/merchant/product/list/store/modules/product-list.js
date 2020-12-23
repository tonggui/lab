import mergeModule from '@/store/helper/merge-module'
import createSortProductListStore from '@/store/modules/sort-product-list'
import message from '@/store/helper/toast'
import {
  defaultMedicineMerchantProductStatus,
  medicineMerchantProductStatus
} from '@/data/constants/product'

const defaultState = {
  statusList: medicineMerchantProductStatus,
  status: defaultMedicineMerchantProductStatus
}

export default (api) => {
  const productListStoreInstance = createSortProductListStore(api, defaultState)
  return mergeModule(productListStoreInstance, {
    actions: {
      async getList ({ state, commit }) {
        try {
          commit('setLoading', true)
          commit('setError', false)
          const result = await api.getList({
            status: state.status,
            tagId: state.tagId
          }, state.pagination)
          const { statistics = {} } = result
          const statusList = medicineMerchantProductStatus.map((item) => {
            if (item.key in statistics) {
              return {
                ...item,
                count: item.key in statistics ? statistics[item.key] : 0
              }
            }
            return item
          })
          commit('setStatusList', statusList)
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
      async delete ({ state, dispatch }, { product, params }) {
        await api.delete(product, params)
        // 删除最后一个商品的时候，分页需要往前推一页
        if (state.list.length === 1) {
          dispatch('pagePrev')
        }
      },
      async modifySkuList ({ commit }, { product, skuList, type, params }) {
        await api.modifySkuList(type, product, skuList, params)
        commit('modify', { ...product, skuList })
      }
    }
  })
}
