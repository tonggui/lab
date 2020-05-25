import {
  defaultPagination
} from '@/data/constants/common'
import {
  defaultTagId
} from '@/data/constants/poi'

let initState = {
  loading: false, // 加载状态
  error: false, // 错误状态
  list: [], // 商品列表
  pagination: { ...defaultPagination }, // 商品列表 分页信息
  tagId: defaultTagId // 当前是的分类id
}

export default {
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
    setPagination (state, payload) {
      state.pagination = {
        ...state.pagination,
        ...payload
      }
    }
  },
  actions: {

  }
}
