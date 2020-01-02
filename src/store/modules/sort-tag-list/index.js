import createTagListStore from '@/store/modules/tag-list'
import extend from '@/store/modules/helper/merge-module'

export default (api) => {
  const tagListStore = createTagListStore(api)
  return extend(tagListStore, {
    state: {
      sorting: false, // 排序中
      sortInfo: {
        topLimit: Infinity, // 智能排数置顶数目
        isSmartSort: false // 是否开启智能排序中
      }
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
      async sort ({ commit, state }, { tagList, sortList, tag }) {
        try {
          commit('loading', true)
          if (state.sortInfo.isSmartSort) {
            const smartTagList = tagList.filter(item => item.isSmartSort)
            let sequence = smartTagList.length
            if (tag.isSmartSort) {
              sequence = smartTagList.findIndex(item => item.id === tag.id)
            }
            await api.smartSort({ tag, sequence })
          } else {
            const sequence = sortList.findIndex(t => t.id === tag.id)
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
      }
    }
  })
}
