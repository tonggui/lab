import {
  allProductTag
} from '@/data/constants/poi'
import api from './api'

export default (platform) => {
  const fetch = api[platform]
  return ({
    state () {
      return {
        loading: false, // 加载状态
        error: false, // 错误标志
        list: [], // 分类列表
        currentTag: { ...allProductTag }, // 当前选择的分类
        expandList: [], // 当前展开的分类idList
        productCount: 0, // 门店商品总数
        sortInfo: {
          topLimit: Infinity, // 智能排数置顶数目
          isSmartSort: false // 是否开启智能排序中
        }
      }
    },
    getters: {
      currentTagId (state) {
        return state.currentTag.id
      },
      topLimit (state) {
        return state.sortInfo.topLimit
      },
      isSmartSort (state) {
        return state.sortInfo.isSmartSort
      },
      list (state) {
        return state.list
      },
      // 当前是否选中的是 全部商品 分类
      isSelectAllProductTag (state) {
        return state.currentTag.id === allProductTag.id
      }
    },
    mutations: {
      loading (state, payload) {
        state.loading = payload
      },
      error (state, payload) {
        state.error = payload
      },
      select (state, payload) {
        state.currentTag = payload
      },
      productCount (state, payload) {
        state.productCount = payload
      },
      setList (state, payload) {
        state.list = payload
      },
      sortInfo (state, payload) {
        state.sortInfo = {
          ...state.sortInfo,
          ...payload
        }
      },
      smartSort (state, payload) {
        state.sortInfo.isSmartSort = payload
      },
      expandList (state, payload) {
        state.expandList = payload
      }
    },
    actions: {
      async getList ({ commit }) {
        try {
          commit('loading', true)
          const { tagList, tagInfo } = await fetch.getList(true)
          const { productTotal, topLimit, smartSortSwitch: isSmartSort } = tagInfo
          commit('productCount', productTotal)
          commit('sortInfo', {
            topLimit,
            isSmartSort
          })
          commit('setList', tagList)
          commit('error', false)
        } catch (err) {
          console.error(err)
          commit('error', true)
        } finally {
          commit('loading', false)
        }
      },
      async add ({ state, dispatch, commit }, tag) {
        try {
          const id = await fetch.add(tag.id, tag.parentId)
          const currentTagId = state.currentTag.id
          // 如果当前 选择的 分类是新增分类非父id，那么新增完了，当前选择分类就不是叶子分类，就不可以是选中，要切换到儿子节点
          if (currentTagId !== allProductTag.id && currentTagId === tag.parentId) {
            if (id !== currentTagId) {
              commit('select', { ...tag, id })
            }
          }
          dispatch('getList')
        } catch (err) {
          console.error(err)
        }
      },
      async modify ({ dispatch }, tag) {
        try {
          await fetch.modify(tag)
          dispatch('getList')
        } catch (err) {
          console.error(err)
        }
      },
      async delete ({ state, dispatch, commit }, { tag, type }) {
        try {
          await fetch.delete(tag, type)
          const currentTagId = state.currentTag.id
          // 如果当前 选择的 分类是新增分类非父id，那么新增完了，当前选择分类就不是叶子分类，就不可以是选中，要切换到儿子节点
          if (currentTagId !== tag.id || tag.children.includes(item => item.id === currentTagId)) {
            commit('select', allProductTag)
          }
          dispatch('getList')
        } catch (err) {
          console.error(err)
        }
      },
      async changeLevel ({ state, dispatch, commit }, tag) {
        try {
          await fetch.changeLevel(tag)
          const currentTagId = state.currentTag.id
          // 如果有tag变成 当前 选中的 tag的子分类的时候，当前分类就不是叶子了，无法再选中，需要trigger到子分类上
          if (currentTagId === tag.parentId) {
            commit('select', tag)
          }
          dispatch('getList')
        } catch (err) {
          console.error(err)
        }
      },
      toggleSmartSort ({ commit }, status) {
        commit('smartSort', status)
      },
      select ({ commit }, item) {
        commit('select', item)
      },
      expand ({ commit }, expandList) {
        commit('expandList', expandList)
      }
    }
  })
}
