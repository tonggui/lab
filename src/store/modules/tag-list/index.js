import {
  allProductTag
} from '@/data/constants/poi'

export default (api) => {
  return ({
    state () {
      return {
        loading: false, // 加载状态
        error: false, // 错误标志
        sorting: false, // 排序中
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
        state.list = state.list.map(tag => ({
          ...tag,
          isSmartSort: false
        }))
      },
      expandList (state, payload) {
        state.expandList = payload
      }
    },
    actions: {
      async getList ({ commit }) {
        try {
          commit('loading', true)
          const { tagList, tagInfo } = await api.getList(true)
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
      async delete ({ state, dispatch, commit }, { tag, type }) {
        await api.delete(tag.id, type)
        const currentTagId = state.currentTag.id
        if (currentTagId === tag.id || tag.children.some(item => item.id === currentTagId)) {
          dispatch('select', allProductTag)
        }
        dispatch('getList')
      },
      async changeLevel ({ state, dispatch, commit }, tag) {
        await api.changeLevel(tag.id, tag.parentId)
        const currentTagId = state.currentTag.id
        // 如果有tag变成 当前 选中的 tag的子分类的时候，当前分类就不是叶子了，无法再选中，需要trigger到子分类上
        if (currentTagId === tag.parentId) {
          dispatch('select', tag)
        }
        dispatch('getList')
      },
      async sort ({ commit, state }, { tagList, sortList, tag }) {
        try {
          commit('loading', true)
          if (state.sortInfo.isSmartSort) {
            const smartTagList = tagList.filter(item => item.isSmartSort)
            let sequence = smartTagList.length
            if (tag.isSmartSort) {
              sequence = smartTagList.findIndex(item => item.id === tag.id)
            }
            await api.smartSort(tag.id, tag.isSmartSort, sequence)
          } else {
            await api.dragSort(sortList.map(tag => tag.id))
          }
          commit('setList', tagList)
        } catch (err) {
          console.error(err)
          throw err
        } finally {
          commit('loading', false)
        }
      },
      async toggleSmartSort ({ commit }, status) {
        try {
          commit('loading', true)
          await api.changeSortType(status)
          commit('smartSort', status)
        } catch (err) {
          console.error(err)
          throw err
        } finally {
          commit('loading', false)
        }
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
