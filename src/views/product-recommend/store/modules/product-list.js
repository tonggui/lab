import {
  defaultPagination
} from '@/data/constants/common'
import {
  defaultTagId
} from '@/data/constants/poi'
import message from '@/store/helper/toast'

let initState = {
  loading: false, // 加载状态
  error: false, // 错误状态
  list: [], // 商品列表
  pagination: { ...defaultPagination }, // 商品列表 分页信息
  tagId: defaultTagId // 当前是的分类id
}

export default (api) => {
  return {
    state: {
      ...initState
    },
    mutations: {
      setLoading (state, payload) {
        state.loading = !!payload
      },
      setError (state, payload) {
        state.error = !!payload
      },
      setList (state, payload) {
        state.list = Object.freeze(payload)
      },
      setTag (state, payload) {
        state.setTagId = payload
      },
      setPagination (state, payload) {
        state.pagination = {
          ...state.pagination,
          ...payload
        }
      },
      resetPagination (state) {
        state.pagination = {
          ...defaultPagination
        }
      }
    },
    actions: {
      selectProduct ({ dispatch }, products) {
        // console.log('context', context)
        dispatch('productRecommend/selectProduct', products, { root: true })
      },
      deSelectProduct ({ dispatch }, products) {
        dispatch('productRecommend/deSelectProduct', products, { root: true })
      },
      async getList ({ state, commit, dispatch }, query) {
        try {
          commit('setLoading', true)
          commit('setError', false)
          const querys = {
            tagId: state.tagId,
            ...query
          }
          const result = await api.getList(state.pagination, querys)
          const { pageSize, current } = state.pagination
          const { total } = result.pagination
          console.log('result', result)
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
          commit('setList', result.list || [])
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
      }
    },
    getters: {
      getList (state, getters, rootState) {
        // console.log('root', rootState.productRecommend.classifySelectedProducts)
        const list = state.list
        const classifySelectedProducts = rootState.productRecommend.classifySelectedProducts
        list && list.length && list.forEach(item => {
          if (item.tagList && item.tagList.length) {
            const tagName = item.tagList[0].name
            const tagProductList = classifySelectedProducts[tagName]
            if (tagProductList && tagProductList.some(it => it.__id__ === item.__id__)) {
              item.selected = true
            } else {
              item.selected = false
            }
          }
        })
        return list
      },
      getPagination (state) {
        return state.pagination
      }
    }
  }
}
