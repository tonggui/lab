export default {
  state: {
    totalCount: 0,
    classifySelectedProducts: {}
  },
  mutations: {
    setTotalCount (state) {
      let values = Object.values(state.classifySelectedProducts)
      state.totalCount = values.reduce((a, b) => { a += b.data.length; return a }, 0)
    },
    setClassifySelectedProducts (state, products) {
      products.forEach(item => {
        if (item.tagList && item.tagList.length) {
          // 获取最小的tag的id, 即在taglist顺序前面的tag
          console.log('item.tagList', item.tagList)

          const topTag = item.tagList.reduce((a, b) => a.sequence < b.sequence ? a : b)
          const tagName = topTag.name
          const sequence = topTag.sequence
          console.log('tagName', topTag, tagName, sequence, state.classifySelectedProducts[tagName])
          if (!state.classifySelectedProducts[tagName]) state.classifySelectedProducts[tagName] = {}
          state.classifySelectedProducts[tagName]['sequence'] = sequence

          if (!state.classifySelectedProducts[tagName].data) {
            state.classifySelectedProducts[tagName].data = [item]
          } else if (!state.classifySelectedProducts[tagName].data.some(it => it.__id__ === item.__id__)) {
            state.classifySelectedProducts[tagName].data.push(item)
          }
          // if (!state.classifySelectedProducts[tagName].data.some(it => it.__id__ === item.__id__)) {
          //   state.classifySelectedProducts[tagName].data.push(item)
          // } else {
          //   state.classifySelectedProducts[tagName].data = [item]
          // }
        }
      })
      console.log('products', state.classifySelectedProducts)
    },
    clearSelected (state) {
      state.classifySelectedProducts = {}
    },
    deSelect (state, products) {
      products.forEach(item => {
        if (item.tagList && item.tagList.length) {
          // 获取最小的tag的id, 即在taglist顺序前面的tag
          const tagName = item.tagList.reduce((a, b) => a.sequence < b.sequence ? a : b).name
          const idx = state.classifySelectedProducts[tagName].data.findIndex(it => it.__id__ === item.__id__)
          const data = state.classifySelectedProducts
          data[tagName].data.splice(idx, 1)
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
    },
    clearSelected ({ commit }) {
      commit('clearSelected')
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
