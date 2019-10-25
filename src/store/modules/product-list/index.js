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

export default (api) => ({
  state () {
    return {
      loading: false, // 加载状态
      error: false, // 错误状态
      list: [], // 商品列表
      status: PRODUCT_STATUS.ALL, // 当前选择的商品状态
      statusList: productStatus, // 商品状态列表
      pagination: { ...defaultPagination }, // 商品列表 分页信息
      sorter: {}, // 商品列表 字段排序
      tagId: defaultTagId // 当前是的分类id
    }
  },
  mutations: {
    loading (state, payload) {
      state.loading = !!payload
    },
    error (state, payload) {
      state.error = !!payload
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
    pagination (state, payload) {
      state.pagination = {
        ...state.pagination,
        ...payload
      }
    },
    modify (state, product) {
      const index = state.list.findIndex(p => p.id === product.id)
      if (index >= 0) {
        const list = [...state.list]
        list.splice(index, 1, product)
        state.list = list
      }
    },
    modifySku (state, { product, sku }) {
      const index = state.list.findIndex(p => p.id === product.id)
      if (index >= 0) {
        const skuIndex = product.skuList.findIndex(s => s.id === sku.id)
        if (skuIndex >= 0) {
          const list = [...state.list]
          const skuList = [...product.skuList]
          skuList.splice(skuIndex, 1, sku)
          list.splice(index, 1, {
            ...product,
            skuList
          })
          state.list = list
        }
      }
    },
    sorter (state, payload) {
      state.sorter = payload
    },
    tagId (state, payload) {
      state.tagId = payload
    },
    resetPagination (state) {
      state.pagination.current = 1
    },
    resetStatus (state) {
      state.status = PRODUCT_STATUS.ALL
    },
    resetSorter (state) {
      state.sorter = {}
    }
  },
  actions: actions(api)
})
