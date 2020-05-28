export default {
  state: {
    totalCount: 0,
    classifySelectedProducts: {}
  },
  mutations: {
    setTotalCount (state) {
      let values = Object.values(state.classifySelectedProducts)
      console.log('values', values)
      state.totalCount = values.reduce((a, b) => { a += b.length; return a }, 0)
    },
    setClassifySelectedProducts (state, products) {
      products.forEach(item => {
        if (item.tagList && item.tagList.length) {
          const tagName = item.tagList[0].name
          if (state.classifySelectedProducts[tagName] && !state.classifySelectedProducts[tagName].some(it => it.__id__ === item.__id__)) {
            state.classifySelectedProducts[tagName].push(item)
          } else {
            state.classifySelectedProducts[tagName] = [item]
          }
        }
      })
      console.log('21', state.classifySelectedProducts)
    },
    clearSelected (state) {
      state.classifySelectedProducts = {}
    },
    deSelect (state, products) {
      products.forEach(item => {
        if (item.tagList && item.tagList.length) {
          const tagName = item.tagList[0].name
          const idx = state.classifySelectedProducts[tagName].findIndex(it => it.__id__ === item.__id__)
          console.log('idx', idx)
          const data = state.classifySelectedProducts
          data[tagName].splice(idx, 1)
          state.classifySelectedProducts = Object.assign({}, data)
        }
      })
    }
  },
  actions: {
    selectProduct ({ commit, rootGetters }, products) {
      console.log('productRecommend/tagList/list', rootGetters['productRecommend/tagList/list'])
      console.log('productsproductsproducts', products)
      commit('setClassifySelectedProducts', products)
      commit('setTotalCount')
    },
    deSelectProduct ({ commit }, products) {
      commit('deSelect', products)
      commit('setTotalCount')
    }
  },
  getters: {
    getSelectedProducts (state) {
      console.log('又反悔吗', state.classifySelectedProducts)
      return state.classifySelectedProducts
    },
    getTotalCount (state) {
      return state.totalCount
    }
  }
}
