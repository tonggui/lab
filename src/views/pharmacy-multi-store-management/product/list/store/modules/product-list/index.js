import {
  defaultPagination
} from '@/data/constants/common'
// import {
//   productStatus
// } from '@/data/constants/product'
// import {
//   PRODUCT_STATUS
// } from '@/data/enums/product'
// import {
//   defaultTagId
// } from '@/data/constants/poi'
import actions from './actions'

let initState = {
  loading: false, // 加载状态
  error: false, // 错误状态
  list: [], // 商品列表
  // status: PRODUCT_STATUS.ALL, // 当前选择的商品状态
  // statusList: productStatus, // 商品状态列表
  pagination: { ...defaultPagination }, // 商品列表 分页信息
  // sorter: {} // 商品列表 字段排序
  // tagId: defaultTagId // 当前是的分类id
  searchParams: {}, // 搜索参数存储
  chooseAll: 0, // 是否全选
  selection: [] // 选中的商品
}

export default (api, defaultState = {}) => ({
  state () {
    initState = { ...initState, ...defaultState }
    return { ...initState }
  },
  mutations: {
    setChooseAll (state, payload) {
      state.chooseAll = payload
    },
    setSelection (state, payload) {
      console.log(payload)
      state.selection = payload
    },
    setLoading (state, payload) {
      state.loading = !!payload
    },
    setError (state, payload) {
      state.error = !!payload
    },
    setList (state, payload) {
      state.list = Object.freeze(payload)
    },
    setStatus (state, payload) {
      state.status = payload
    },
    setStatusList (state, payload) {
      state.statusList = payload
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
    modify (state, product) {
      const index = state.list.findIndex(p => p.id === product.id)
      if (index >= 0) {
        const list = [...state.list]
        list.splice(index, 1, product)
        state.list = list
      }
    },
    modifySku (state, { product, params, type }) {
      // 这个sku是修改过价格的行商品信息
      // console.log(state, product, params, type)
      const list = [...state.list]
      // list[0].price = sku.price.value
      // state.list = list
      const index = state.list.findIndex(p => p.wmProductSkus[0].id === product.wmProductSkus[0].id)
      // console.log('index: ', index, params[type])
      list[index][type] = params[type]
      state.list = list
      // const index = state.list.findIndex(p => p.id === product.id)
      // if (index >= 0) {
      //   const skuIndex = product.skuList.findIndex(s => s.id === sku.id)
      //   if (skuIndex >= 0) {
      //     const list = [...state.list]
      //     const skuList = [...product.skuList]
      //     skuList.splice(skuIndex, 1, sku)
      //     list.splice(index, 1, {
      //       ...product,
      //       skuList
      //     })
      //     state.list = list
      //   }
      // }
    },
    setSorter (state, payload) {
      state.sorter = payload
    },
    setTagId (state, payload) {
      state.tagId = payload
    },
    // resetTagId (state) {
    //   state.tagId = defaultTagId
    // },
    resetPagination (state) {
      state.pagination.current = 1
    },
    // resetStatus (state) {
    //   state.status = PRODUCT_STATUS.ALL
    // },
    resetSorter (state) {
      state.sorter = {}
    },
    destroy (state) {
      state = Object.assign(state, { ...initState })
    }
  },
  actions: actions(api)
})
