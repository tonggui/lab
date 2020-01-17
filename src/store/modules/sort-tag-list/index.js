import createTagListStore from '@/store/modules/tag-list'
import extend from '@/store/helper/merge-module'
import message from '@/store/helper/toast'

const initState = {
  sorting: false, // 排序中
  sortInfo: {
    topLimit: Infinity, // 智能排数置顶数目
    isSmartSort: false // 是否开启智能排序中
  }
}

export default (api, defaultState = {}) => {
  const state = { ...initState, ...defaultState }
  const tagListStore = createTagListStore(api, state)
  return extend(tagListStore, {
    state () {
      return state
    },
    getters: {
      topLimit (state) {
        return state.sortInfo.topLimit
      },
      isSmartSort (state) {
        return state.sortInfo.isSmartSort
      }
    },
    mutations: {
      setSortInfo (state, payload) {
        state.sortInfo = {
          ...state.sortInfo,
          ...payload
        }
      },
      setSmartSort (state, payload) {
        state.sortInfo.isSmartSort = payload
        state.list = state.list.map(tag => ({
          ...tag,
          isSmartSort: false
        }))
      }
    },
    actions: {
      async getList ({ commit }) {
        try {
          commit('setLoading', true)
          commit('setError', false)
          const { tagList, tagInfo } = await api.getList(true)
          const { productTotal, topLimit, smartSortSwitch: isSmartSort } = tagInfo
          commit('setProductCount', productTotal)
          commit('setSortInfo', {
            topLimit,
            isSmartSort
          })
          commit('setList', tagList)
          commit('setError', false)
        } catch (err) {
          console.error(err)
          message.error(err.message)
          commit('setError', true)
        } finally {
          commit('setLoading', false)
        }
      },
      async sort ({ commit, state }, { tagList, sortList, tag }) {
        try {
          commit('setLoading', true)
          if (state.sortInfo.isSmartSort) {
            const smartTagList = tagList.filter(item => item.isSmartSort)
            let sequence = smartTagList.length
            if (tag.isSmartSort) {
              sequence = smartTagList.findIndex(item => item.id === tag.id)
            }
            await api.smartSort({ tag, sequence })
          } else {
            // sequence 从 1 开始计数
            const sequence = sortList.findIndex(t => t.id === tag.id) + 1
            if (sequence <= 0) {
              throw Error('排序sequence错误')
            }
            await api.dragSort({
              tag,
              sequence,
              sortTagIdList: sortList.map(tag => tag.id)
            })
          }
          commit('setList', tagList)
        } catch (err) {
          console.error(err)
          throw err
        } finally {
          commit('setLoading', false)
        }
      },
      async toggleSmartSort ({ commit }, status) {
        try {
          commit('setLoading', true)
          await api.changeSortType(status)
          commit('setSmartSort', status)
        } catch (err) {
          console.error(err)
          throw err
        } finally {
          commit('setLoading', false)
        }
      }
    }
  })
}
