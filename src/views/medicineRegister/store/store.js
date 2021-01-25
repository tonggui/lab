import createMedicineRegisterListStore from './modules/register-list/index'
import api from './api'
import {
  defaultPagination
} from '@/data/constants/common'

const medicineRegisterListStoreInstance = createMedicineRegisterListStore(api.product)

const initState = {
  loading: false, // 加载状态
  error: false, // 错误状态
  list: [], // 商品列表
  pagination: { ...defaultPagination }, // 商品列表 分页信息
  searchParams: {}, // 接口成功-搜索参数存储
  searchParamsBefore: {}, // 接口失败-搜索参数存储
  firstIn: 0 // 首次请求result接口
}

export default {
  namespaced: true,
  state () {
    return initState
  },
  actions: {
    // 获取商品列表
    getProductList ({ dispatch }) {
      dispatch('product/getList')
    },
    // 初始化数据
    getData ({ getters, dispatch, commit }) {
      // const tagId = getters['tagList/currentTagId']
      // commit('product/setTagId', tagId)
      // dispatch('getTagList')
      dispatch('getProductList')
    },
    // changeProductTagId ({ dispatch, commit }, id) {
    //   commit('setProductSorted', false)
    //   commit('product/setTagId', id) // 更新商品管理的分类id
    //   commit('product/resetPagination') // 重置分页
    //   dispatch('getProductList') // 拉分类下商品
    // },
    /**
    * 删除商品的时候 会影响分类数据 所以需要拉分类
    */
    async productDelete ({ dispatch }) {
      // dispatch('getTagList')
      dispatch('getProductList')
    },
    destroy ({ commit }) {
      commit('product/setList', [])
      // commit('tagList/setList', [])
    }
  },
  modules: {
    product: {
      namespaced: true,
      ...medicineRegisterListStoreInstance
    }
  }
}
