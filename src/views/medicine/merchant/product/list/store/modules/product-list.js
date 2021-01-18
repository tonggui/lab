import mergeModule from '@/store/helper/merge-module'
import createSortProductListStore from '@/store/modules/sort-product-list'
import message from '@/store/helper/toast'
import {
  defaultMedicineMerchantProductStatus,
  medicineMerchantProductStatus
} from '@/data/constants/product'
import { MEDICINE_MERCHANT_PRODUCT_STATUS } from '@/data/enums/product'
import { getDateRange } from '@/common/utils'

const defaultState = {
  statusList: medicineMerchantProductStatus,
  status: defaultMedicineMerchantProductStatus
}
const settingStatusList = medicineMerchantProductStatus.filter(item => item.id !== MEDICINE_MERCHANT_PRODUCT_STATUS.INCOMPLETE)
const defaultSearch = getDateRange({ n: 7 }) // 默认取7日内时间区间

export default (api) => {
  const productListStoreInstance = createSortProductListStore(api, defaultState)
  return mergeModule(productListStoreInstance, {
    state: {
      searchData: defaultSearch,
      settingStatus: false,
      statistics: {}
    },
    mutations: {
      setSearchData (state, data) {
        state.searchData = Object.assign({}, defaultSearch, data)
      },
      setSettingStatus (state, status) {
        state.settingStatus = status
      },
      setStatistics (state, data) {
        state.statistics = data
      }
    },
    actions: {
      async getList ({ state, commit }) {
        try {
          commit('setLoading', true)
          commit('setError', false)

          const isAll = state.status === MEDICINE_MERCHANT_PRODUCT_STATUS.ALL

          const result = await api.getList({
            status: state.status,
            tagId: state.tagId,
            searchData: state.searchData
          }, state.pagination)
          let { statistics } = result
          statistics = isAll ? statistics : state.statistics
          const statusList = (state.settingStatus ? settingStatusList : medicineMerchantProductStatus).map((item) => {
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
          // 防止接口返回pageNum:0, pageSize:0将defaultPage信息覆盖掉
          if (result.pagination && result.pagination.current) {
            commit('setPagination', result.pagination)
          }
          isAll && commit('setStatistics', statistics)
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
      },
      async getSettingStatus ({ commit, state }) {
        await api.getBatchOptimizationStatus().then((res) => {
          commit('setSettingStatus', !!res.status)
        })
      },
      setSearch ({ dispatch, commit }, data) {
        commit('setSearchData', data)
        dispatch('resetPagination')
      },
      setDefaultSearch ({ dispatch, commit }, type) {
        commit('setSearchData', {})
        if (type !== 'statusChange') {
          dispatch('resetPagination')
        }
      },
      setSettingStatus ({ state, commit, dispatch }, status) {
        commit('setSettingStatus', status)
        if (state.status === MEDICINE_MERCHANT_PRODUCT_STATUS.INCOMPLETE && status) {
          dispatch('statusChange', defaultMedicineMerchantProductStatus)
        }
      }
    }
  })
}
