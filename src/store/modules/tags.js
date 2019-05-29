/*
 * @description
 *   Please write the tags script's description
 * @author
 *   rdshoep (zhangliang15@meituan.com)
 * @version
 *   1.0.0(2019-05-27)
 */
import { fetchTagList } from '@/data/repos/tagRepository'

export default {
  namespaced: true,
  state () {
    return {
      loading: false,
      list: [],
      selected: null,
      opens: [],
      // 排序状态
      sorting: false,
      // 智能分类指定数量，默认为5
      smartTopLimit: 5,
      // 智能分类开关
      smartSortSwitch: false,
      // 全部分类下的商品数量
      totalProductCount: 0
    }
  },
  mutations: {
    loading (state, loading = false) {
      state.loading = loading
    },
    update (state, payload = {}) {
      Object.assign(state, payload)
    },
    setTags (state, tagList = []) {
      state.list.splice(0, state.list.length, ...(tagList || []))
    }
  },
  actions: {
    async loadTagList ({ commit }) {
      commit('loading', true)
      try {
        const {
          tagList,
          totalCount,
          tagToTopLimit,
          smartSortSwitch = false
        } = await fetchTagList()
        commit('setTags', tagList || [])
        commit('update', {
          totalProductCount: totalCount,
          smartSortSwitch,
          smartTopLimit: tagToTopLimit
        })
      } catch (e) {
        commit('setTags', [])
        commit('update', {
          totalProductCount: 0
        })
      }
      commit('loading', false)
    }
  }
}
