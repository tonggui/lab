import createProductListStore from '@/store/modules/product-list'
import extend from '@/store/modules/helper/merge-module'

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
        // 关闭 智能排序 重置 商品排序字段
        state.list = state.list.map(product => ({
          ...product,
          isSmartSort: false
        }))
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
      async sort ({ commit, state, getters, dispatch }, { productList, product, newSequence }) {
        try {
          commit('loading', true)
          const isSmartSort = getters.isSmartSort
          const query = { tagId: state.tagId }
          if (isSmartSort) {
            // TODO 待确认 分页问题
            const smartProductList = productList.filter(item => item.isSmartSort)
            // 取消置顶 位置
            let sequence = smartProductList.length
            if (product.isSmartSort) {
              sequence = smartProductList.findIndex(item => item.id === product.id)
            }
            await api.smartSort(product.id, sequence, product.isSmartSort, query)
            commit('setList', productList)
          } else {
            const include = productList.find(p => p.id === product.id)
            await api.dragSort(product.id, newSequence, query)
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
