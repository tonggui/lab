// TODO 商品列表和商家商品库列表 暂时差距比较大 分为2个module
import {
  defaultPagination
} from '@/data/constants/common'
import {
  productStatus
} from '@/data/constants/product'
import {
  PRODUCT_STATUS
} from '@/data/enums/product'
import {
  defaultTagId
} from '@/data/constants/poi'
import actions from './actions'

export default {
  state () {
    return {
      loading: false,
      error: false,
      list: [],
      status: PRODUCT_STATUS.ALL,
      statusList: productStatus,
      pagination: { ...defaultPagination },
      sorter: {},
      tagId: defaultTagId,
      sortInfo: {
        isSmartSort: false,
        topCount: 0
      }
    }
  },
  getters: {
    isSmartSort (state) {
      return state.sortInfo.isSmartSort
    }
  },
  mutations: {
    loading (state, payload) {
      state.loading = payload
    },
    error (state, payload) {
      state.error = payload
    },
    setList (state, payload) {
      state.list = payload
    },
    status (state, payload) {
      state.status = payload
    },
    statusList (state, payload) {
      state.statusList = payload
    },
    keyword (state, payload) {
      state.keyword = payload
    },
    pagination (state, payload) {
      state.pagination = {
        ...state.pagination,
        ...payload
      }
    },
    sorter (state, payload) {
      state.sorter = payload
    },
    sortInfo (state, payload) {
      state.sortInfo = {
        ...state.sortInfo,
        ...payload
      }
    },
    smartSort (state, payload) {
      state.sortInfo.isSmartSort = !!payload
    },
    tagId (state, payload) {
      state.tagId = payload
    },
    resetPagination (state) {
      state.pagination.current = 1
    }
  },
  actions
}
