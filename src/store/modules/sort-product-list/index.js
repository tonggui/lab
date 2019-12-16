import createProductListStore from '@/store/modules/product-list'
import extend from '@/store/modules/helper/merge-module'
import { sleep } from '@/common/utils'
import {
  TOP_STATUS
} from '@/data/enums/common'

export default (api) => {
  const productStore = createProductListStore(api)
  return extend(productStore, {
    state: {
      sorting: false,
      sortInfo: {
        isSmartSort: false,
        topCount: 0
      }
    },
    getters: {
      isSmartSort (state) {
        return state.sortInfo.isSmartSort
      }
    },
    mutations: {
      sorting (state, payload) {
        state.sorting = payload
      },
      sortInfo (state, payload) {
        state.sortInfo = {
          ...state.sortInfo,
          ...payload
        }
      },
      smartSort (state, payload) {
        state.sortInfo.isSmartSort = !!payload
        state.sortInfo.topCount = 0
        // 关闭 智能排序 重置 商品排序字段
        state.list = state.list.map(product => ({
          ...product,
          isSmartSort: false
        }))
      },
      topCount (state, payload) {
        state.sortInfo.topCount = payload
      }
    },
    actions: {
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
      /**
       * 商品排序
       * @param {*} newSequence 主要用于拖拽排序，商品排序存在分页，newSequence是传递给后端的真正位置，从1开始计数
       */
      async sort ({ commit, state, getters, dispatch }, { productList, product, sortOptions = {} }) {
        try {
          commit('loading', true)
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
            commit('topCount', topCount)
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
              dispatch('getList')
            } else {
              commit('setList', productList)
            }
          }
        } catch (err) {
          console.error(err)
          throw err
        } finally {
          commit('loading', false)
        }
      },
      async toggleSmartSort ({ commit, state }, smartSort) {
        try {
          commit('loading', true)
          await api.changeSortType(smartSort, state.sortInfo.topCount, state.tagId)
          commit('smartSort', !!smartSort)
        } catch (err) {
          console.error(err)
          throw err
        } finally {
          commit('loading', false)
        }
      }
    }
  })
}
