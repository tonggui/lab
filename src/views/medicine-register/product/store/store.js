import createMedicineRegisterListStore from './modules/register-list/index'
import api from './api'

const medicineRegisterListStoreInstance = createMedicineRegisterListStore(api.product)

export default {
  namespaced: true,
  state: {},
  actions: {
    // 获取配置列表
    getProductList ({ dispatch }) {
      dispatch('product/getList')
    },
    // 初始化数据
    getData ({ getters, dispatch, commit }) {
      dispatch('getProductList')
    },
    async productDelete ({ dispatch }) {
      dispatch('getProductList')
    },
    destroy ({ commit }) {
      commit('product/setList', [])
    }
  },
  modules: {
    product: {
      namespaced: true,
      ...medicineRegisterListStoreInstance
    }
  }
}
