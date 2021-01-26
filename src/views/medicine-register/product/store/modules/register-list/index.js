import {
  defaultPagination
} from '@/data/constants/common'
import actions from './actions'

let initState = {
  loading: false, // 加载状态
  error: false, // 错误状态
  list: [], // 商品列表
  cityList: [], // 城市列表
  pagination: { ...defaultPagination }, // 商品列表 分页信息
  searchParams: {}, // 接口成功-搜索参数存储
  searchParamsBefore: {}, // 接口失败-搜索参数存储
  firstIn: 0 // 首次请求result接口
}

export default (api, defaultState = {}) => ({
  state () {
    initState = { ...initState, ...defaultState }
    return { ...initState }
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
    setCityList (state, payload) {
      state.cityList = payload
    },
    setPagination (state, payload) {
      state.pagination = {
        ...state.pagination,
        ...payload
      }
    },
    setSearchParams (state, payload) {
      state.searchParams = Object.assign({}, payload)
    },
    setSearchParamsBefore (state, payload) {
      state.searchParamsBefore = Object.assign({}, payload)
    },
    setFirstIn (state, payload) {
      state.firstIn = payload
    },
    modify (state, product) {
      const index = state.list.findIndex(p => p.spuId === product.spuId)
      if (index >= 0) {
        const list = [...state.list]
        list.splice(index, 1, product)
        state.list = list
      }
    },
    resetPagination (state) {
      state.pagination.current = 1
    },
    destroy (state) {
      state = Object.assign(state, { ...initState })
    }
  },
  actions: actions(api)
})
