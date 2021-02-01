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
  searchParams: {
    cityIds: [], // 城市
    purchaseType: -1, // 购买方式要求
    matchingRules: -1, // 商品识别方式
    productInfo: '' // 商品信息
  }, // 接口成功-搜索参数存储
  searchParamsBefore: {} // 接口失败-搜索参数存储
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
    setSearchParamsBefore (state, payload) {
      state.searchParamsBefore = Object.assign({}, payload)
    },
    resetPagination (state) {
      state.pagination.current = 1
    },
    resetSearchParams (state) {
      const initSearchParams = {
        cityIds: [],
        purchaseType: -1,
        matchingRules: -1,
        productInfo: ''
      }
      state.searchParams = Object.assign({}, initSearchParams)
    },
    destroy (state) {
      state = Object.assign(state, { ...initState })
    }
  },
  actions: actions(api)
})
