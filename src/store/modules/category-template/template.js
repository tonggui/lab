export default (api) => ({
  state: {
    list: [],
    selectedIndex: -1
  },
  getters: {
    currentTemplate (state) {
      const { list, selectedIndex } = state
      return list[selectedIndex]
    }
  },
  mutations: {
    setEmpty (state) {
      state.list = []
      state.selectedIndex = -1
    },
    setList (state, list) {
      state.list = list
    },
    setSelectedIndex (state, index) {
      state.selectedIndex = index
    },
    setFetchingTemplate (state, { fetching, index }) {
      const { list } = state
      const template = list[index]
      if (template) {
        template.status.fetching = fetching
      }
    },
    setTemplate (state, { template, index }) {
      const { list } = state
      const prevTemplate = list[index]
      if (prevTemplate) {
        prevTemplate.status = { ...prevTemplate.status, ...template.status }
        prevTemplate.detail = { ...prevTemplate.detail, ...template.detail }
      }
    },
    reset (state) {
      state.list = []
      state.selectedIndex = -1
    }
  },
  actions: {
    async getOptions ({ commit, dispatch }) {
      const options = await api.getOptions()
      if (!options || options.length <= 0) {
        commit('setEmpty')
      } else {
        let selectedIndex = options.findIndex(i => !!i.selected)
        selectedIndex = Math.max(selectedIndex, 0)
        const formatList = options.map(template => {
          return {
            detail: { ...template },
            status: {
              loaded: false,
              error: false,
              fetching: false
            }
          }
        })
        commit('setList', formatList)
        dispatch('changeSelectedIndex', selectedIndex)
      }
    },
    async getTemplateDetail ({ commit }, { index, template }) {
      try {
        commit('setFetchingTemplate', { fetching: true, index })
        const detail = await api.getDetail(template.detail)
        commit('setTemplate', {
          template: { detail, status: { loaded: true, error: false } },
          index
        })
      } catch (err) {
        console.error(err)
        commit('setTemplate', {
          template: { detail: {}, status: { loaded: true, error: true } },
          index
        })
      } finally {
        commit('setFetchingTemplate', { fetching: false, index })
      }
    },
    loadTemplate ({ dispatch, state }) {
      const { list, selectedIndex } = state
      if (selectedIndex < 0 || selectedIndex >= list.length) {
        return
      }
      const loadList = [{
        index: selectedIndex,
        template: list[selectedIndex]
      }, {
        index: selectedIndex + 1,
        template: list[selectedIndex + 1]
      }]
      loadList.forEach(({ template, index }) => {
        const isNeedLoad = template && (!template.loaded || template.error)
        if (isNeedLoad) {
          dispatch('getTemplateDetail', { template, index })
        }
      })
    },
    changeSelectedIndex ({ commit, dispatch }, index) {
      commit('setSelectedIndex', index)
      dispatch('loadTemplate')
    },
    changeTemplateDetail ({ commit, state }, template) {
      const index = state.list.findIndex((t) => t.detail.id === template.detail.id)
      commit('setTemplate', { template, index })
    }
  }
})
