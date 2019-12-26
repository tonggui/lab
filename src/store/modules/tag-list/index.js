import {
  allProductTag
} from '@/data/constants/poi'

const initState = {
  loading: false, // 加载状态
  error: false, // 错误标志
  list: [], // 分类列表
  currentTag: { ...allProductTag }, // 当前选择的分类
  expandList: [], // 当前展开的分类idList
  productCount: 0 // 门店商品总数
}

export default (api) => {
  return ({
    state () {
      return { ...initState }
    },
    getters: {
      currentTagId (state) {
        return state.currentTag.id
      },
      list (state) {
        return state.list
      }
    },
    mutations: {
      loading (state, payload) {
        state.loading = !!payload
      },
      error (state, payload) {
        state.error = !!payload
      },
      select (state, payload) {
        state.currentTag = payload
      },
      productCount (state, payload) {
        state.productCount = payload
      },
      setList (state, payload) {
        state.list = Object.freeze(payload)
      },
      expandList (state, payload) {
        state.expandList = payload
      },
      destroy (state) {
        state = { ...state, ...initState }
      }
    },
    actions: {
      async getList ({ commit }) {
        try {
          commit('loading', true)
          const { tagList, tagInfo } = await api.getList()
          const { productTotal } = tagInfo
          commit('productCount', productTotal)
          commit('setList', tagList)
          commit('error', false)
        } catch (err) {
          console.error(err)
          commit('error', true)
        } finally {
          commit('loading', false)
        }
      },
      async add ({ state, dispatch }, tag) {
        const id = await api.add(tag)
        const currentTagId = state.currentTag.id
        // 如果当前 选择的 分类是新增分类非父id，那么新增完了，当前选择分类就不是叶子分类，就不可以是选中，要切换到儿子节点
        if (currentTagId !== allProductTag.id && currentTagId === tag.parentId && id !== currentTagId) {
          dispatch('select', { ...tag, id })
        }
        // 刷新列表
        dispatch('getList')
      },
      async modify ({ dispatch }, tag) {
        await api.modify(tag)
        dispatch('getList')
      },
      async delete ({ state, dispatch }, { tag, type }) {
        await api.delete(tag.id, type)
        const currentTagId = state.currentTag.id
        if (currentTagId === tag.id || tag.children.some(item => item.id === currentTagId)) {
          dispatch('select', allProductTag)
        }
        dispatch('getList')
      },
      async changeLevel ({ state, dispatch }, tag) {
        await api.changeLevel(tag.id, tag.parentId)
        const currentTagId = state.currentTag.id
        // 如果有tag变成 当前 选中的 tag的子分类的时候，当前分类就不是叶子了，无法再选中，需要trigger到子分类上
        if (currentTagId === tag.parentId) {
          dispatch('select', tag)
        }
        dispatch('getList')
      },
      select ({ commit }, item) {
        commit('select', item)
      },
      expand ({ commit }, expandList) {
        commit('expandList', expandList)
      },
      resetCurrentTag ({ commit }) {
        commit('select', { ...allProductTag })
      },
      destroy ({ commit }) {
        commit('destroy')
      }
    }
  })
}
