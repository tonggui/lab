export default {
  state: {
    totalCount: 0,
    classifySelectedProducts: {}
  },
  mutations: {
    setTotalCount (state) {
      let values = Object.values(state.classifySelectedProducts)
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
    },
    clearSelected (state) {
      state.classifySelectedProducts = {}
    },
    deSelect (state, products) {
      products.forEach(item => {
        if (item.tagList && item.tagList.length) {
          const tagName = item.tagList[0].name
          const idx = state.classifySelectedProducts[tagName].findIndex(it => it.__id__ === item.__id__)
          const data = state.classifySelectedProducts
          data[tagName].splice(idx, 1)
          state.classifySelectedProducts = Object.assign({}, data)
        }
      })
    }
  },
  actions: {
    selectProduct ({ commit }, products) {
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
      return state.classifySelectedProducts
    },
    getTotalCount (state) {
      return state.totalCount
    }
  }
}
