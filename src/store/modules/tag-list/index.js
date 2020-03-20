import mergeModule from '@/store/helper/merge-module'
import createBaseTagListStore from '@/store/modules/base-tag-list'
import {
  allProductTag
} from '@/data/constants/poi'

const initState = {
  currentTag: { ...allProductTag } // 当前选择的分类
}

export default (api, defaultState = {}) => {
  const state = { ...initState, ...defaultState }
  const baseTagListStore = createBaseTagListStore(api, state)
  return mergeModule(baseTagListStore, {
    state () {
      return state
    },
    getters: {
      currentTagId (state) {
        return state.currentTag.id
      }
    },
    mutations: {
      select (state, payload) {
        state.currentTag = payload
      }
    },
    actions: {
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
      select ({ commit, state }, item) {
        commit('select', item)
        if (item.level > 0) {
          const expandList = state.expandList.slice(0, item.level)
          const id = expandList[item.level - 1]
          if (id !== item.parentId) {
            commit('setExpandList', [item.parentId])
          }
        }
      },
      resetCurrentTag ({ commit }) {
        commit('select', { ...allProductTag })
      }
    }
  })
}
