import createProductListStore from '@/store/modules/product-list'
import extend from '@/store/helper/merge-module'
import message from '@/store/helper/toast'
import {
  TOP_STATUS
} from '@/data/enums/common'
import { sleep } from '@/common/utils'

export default (api, defaultState) => {
  const state = {
    sorting: false,
    sortInfo: {
      isSmartSort: false,
      topCount: 0
    },
    ...defaultState
  }
  const productStore = createProductListStore(api, state)
  return extend(productStore, {
    state,
    getters: {
      isSmartSort (state) {
        return state.sortInfo.isSmartSort
      }
    },
    mutations: {
      setSorting (state, payload) {
        state.sorting = payload
      },
      setSortInfo (state, payload) {
        state.sortInfo = {
          ...state.sortInfo,
          ...payload
        }
      },
      setSmartSort (state, payload) {
        state.sortInfo.isSmartSort = !!payload
        state.sortInfo.topCount = 0
        // 关闭 智能排序 重置 商品排序字段
        state.list = state.list.map(product => ({
          ...product,
          isSmartSort: false
        }))
      },
      setTopCount (state, payload) {
        state.sortInfo.topCount = payload
      }
    },
    actions: {
      async getList ({ state, commit }) {
        try {
          commit('setLoading', true)
          commit('setError', false)
          let result
          const query = {
            status: state.status,
            tagId: state.tagId,
            sorter: state.sorter
          }
          if (state.sorting) {
            result = await api.getSortList(query, state.pagination)
            commit('setSortInfo', result.sortInfo)
          } else {
            result = await api.getList(query, state.pagination, state.statusList)
            commit('setStatusList', result.statusList)
          }
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
      /**
       * 商品排序
       * @param {*} newSequence 主要用于拖拽排序，商品排序存在分页，newSequence是传递给后端的真正位置，从1开始计数
       */
      async sort ({ commit, state, getters, dispatch }, { productList, product, sortOptions = {} }) {
        try {
          commit('setLoading', true)
          // 当前是否是智能排序
          const isSmartSort = getters.isSmartSort
          // 接口必要参数
          const query = { tagId: state.tagId }
          // !!!stick是智能排序中 推到第一个的标志 true 代表推到第一个，不是置顶或取消置顶
          // !!!newIndex 是普通排序 中 商品新位置
          const { stick = false, newIndex } = sortOptions
          if (isSmartSort) {
            let type
            let sequence
            // 记录已经置顶的商品数量
            let { topCount } = state.sortInfo
            if (stick) { // 最前直接设置0
              sequence = 0
              type = TOP_STATUS.STICK
            } else {
              // 置顶的时候 是放到topCount位置 扩大 topCount
              // 移除置顶的时候 是放到置顶之外的第一个 还是放到topCount 再减小topCount
              // topCount = 2 ==> [A，B] -> [c] ==> 置顶c ==> c放到2的位置 [A，B，C] ==> topCount + 1 ===> 3
              // topCount = 2 ==> [A，B] -> [c] ==> 取消置顶B ==> B放到1的位置 [A]，[B，c] ==> topCount - 1 ===> 1
              // 设置置顶
              if (product.isSmartSort) {
                type = TOP_STATUS.TOP
                topCount += 1
                sequence = topCount - 1 // 因为 sequence 从 0 开始计数，所以就是 topCount - 1
              } else {
                type = TOP_STATUS.NOT_TOP
                topCount -= 1
                sequence = topCount // 因为 sequence 从 0 开始计数
              }
            }
            await api.smartSort(product.id, sequence, type, query)
            commit('setList', productList)
            commit('setTopCount', topCount)
            commit('setLoading', false)
          } else {
            /**
             * 1. 判断product 是否在 productList中
             * true 在 表示 还属于 当页处理范围中 直接请求改顺序 ==> setList（设置list）
             * false 不在 表示 不属于本页的处理范围中 请求改顺序 ==> getList（重新请求数据）
             */
            const include = productList.find(p => p.id === product.id)
            await api.dragSort(product.id, newIndex, query)
            // 排序超出当页控制范围
            if (!include) {
              await sleep(1000)
              dispatch('getList')
            } else {
              commit('setList', productList)
              commit('setLoading', false)
            }
          }
        } catch (err) {
          commit('setLoading', false)
          console.error(err)
          throw err
        }
      },
      async toggleSmartSort ({ commit, state }, smartSort) {
        try {
          commit('setLoading', true)
          await api.changeSortType(smartSort, state.sortInfo.topCount, state.tagId)
          commit('setSmartSort', !!smartSort)
        } catch (err) {
          console.error(err)
          throw err
        } finally {
          commit('setLoading', false)
        }
      }
    }
  })
}
