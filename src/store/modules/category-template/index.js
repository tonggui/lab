import message from '@/store/modules/helper/toast'

const STATUS = {
  DEFAULT: 0,
  TEMPLATE: 1,
  PREVIEW: 2,
  APPLYING: 3,
  BACKGROUND_APPLYING: 4, // 后台运行
  FAIL: 5,
  SUCCESS: 6
}
/**
 * 分类模版流程
 * 不展示      选模版       浏览        应用中       后台运行 应用中       结束（成功/失败）
 * default -> template -> preview -> applying -> background_applying -> fail/success
 */
export default (api) => ({
  state: {
    status: STATUS.DEFAULT, // 分类模版 流程
    taskId: null, // 分类模版任务 重试需要，还有刷新之后获取 有个默认值
    sleep: 5000, // 分类模版任务轮询时间 刷新有个默认值
    templateList: [], // 模版列表
    selectedIndex: -1, // 模版选择的
    preview: { tagList: [] }, // 预览的分类信息
    loading: false,
    error: false,
    templateError: false,
    fetchingTemplate: false,
    message: '', // 成功/失败原因
    timer: null // 轮训timer
  },
  mutations: {
    loading (state, payload) {
      state.loading = payload
    },
    fetchingTemplate (state, payload) {
      state.fetchingTemplate = payload
    },
    error (state, payload) {
      state.error = payload
    },
    empty (state) {
      state.templateList = []
      state.selectedIndex = -1
    },
    templateList (state, list) {
      state.templateList = list
    },
    template (state, detail) {
      const index = state.selectedIndex
      const template = state.templateList[index]
      if (!template) {
        throw Error('模版获取错误')
      }
      state.templateList.splice(index, 1, {
        ...template,
        ...detail
      })
    },
    selectedIndex (state, index) {
      state.selectedIndex = index
    },
    timer (state, timer) {
      state.timer = timer
    },
    success (state, message) {
      state.message = message
      state.status = STATUS.SUCCESS
    },
    fail (state, message) {
      state.message = message
      state.status = STATUS.FAIL
    },
    start (state) {
      state.status = STATUS.TEMPLATE
    },
    done (state) {
      /**
       * 整体重置
       */
      state.status = STATUS.DEFAULT
      state.taskId = null
      state.sleep = 5000
      state.templateList = []
      state.selectedIndex = -1
      state.message = ''
    },
    backTemplate (state) {
      state.status = STATUS.TEMPLATE
    },
    preview (state, tagList) {
      state.status = STATUS.PREVIEW
      state.preview.tagList = tagList || []
    },
    refresh (state) {
      state.status = STATUS.TEMPLATE
    },
    setTask (state, { taskId, sleep }) {
      state.taskId = taskId
      state.sleep = sleep
    },
    apply (state) {
      state.status = STATUS.APPLYING
    },
    backgroundApply (state) {
      state.status = STATUS.BACKGROUND_APPLYING
    },
    retry (state, { taskId, sleep }) {
      state.taskId = taskId
      state.sleep = sleep
      state.status = STATUS.BACKGROUND_APPLYING
    }
  },
  getters: {
    visible (state) {
      return [STATUS.TEMPLATE, STATUS.PREVIEW].includes(state.status)
    },
    showApplying (state) {
      return state.status === STATUS.APPLYING
    },
    success (state) {
      return state.status === STATUS.SUCCESS
    },
    fail (state) {
      return state.status === STATUS.FAIL
    },
    message (state) {
      return state.message
    },
    showTemplate (state) {
      return state.status === STATUS.TEMPLATE
    },
    showPreview (state) {
      return state.status === STATUS.PREVIEW
    },
    previewTagList (state) {
      return state.preview.tagList
    },
    taskApplying (state) {
      return [STATUS.APPLYING, STATUS.BACKGROUND_APPLYING].includes(state.status)
    }
  },
  actions: {
    startTask ({ commit, dispatch }, { taskId, sleep, backgroundApply = false }) {
      if (taskId > 0) {
        commit('setTask', { taskId, sleep })
        if (backgroundApply) {
          commit('backgroundApply')
        } else {
          commit('apply')
        }
        dispatch('polling')
      }
    },
    async getOptions ({ commit, dispatch }) {
      try {
        commit('loading', true)
        const options = await api.getOptions()
        if (!options || options.length <= 0) {
          commit('empty')
        } else {
          const selectedIndex = options.findIndex(i => !!i.selected)
          commit('templateList', options.map(i => ({ ...i, loaded: false, error: false })))
          dispatch('changeSelectedIndex', Math.max(selectedIndex, 0))
        }
        commit('error', false)
      } catch (err) {
        console.error(err)
        commit('error', true)
      } finally {
        commit('loading', false)
      }
    },
    async getTemplate ({ commit, state }) {
      const { templateList, selectedIndex } = state
      const template = templateList[selectedIndex]
      if (template.loaded && !template.error) {
        return
      }
      try {
        commit('fetchingTemplate', true)
        const detail = await api.getDetail(templateList[selectedIndex])
        commit('template', { ...detail, loaded: true, error: false })
      } catch (err) {
        console.error(err)
        commit('template', { loaded: true, error: true })
      } finally {
        commit('fetchingTemplate', false)
      }
    },
    changeSelectedIndex ({ commit, dispatch }, index) {
      commit('selectedIndex', index)
      dispatch('getTemplate')
    },
    changeTemplate ({ commit }, template) {
      commit('template', template)
    },
    show ({ commit, dispatch, state }) {
      if (state.status === STATUS.DEFAULT) {
        commit('start')
        dispatch('getOptions')
      } else {
        message.error('门店分类自动生成中，请稍后再使用分类模版功能~')
      }
    },
    hide ({ commit }) {
      commit('done')
    },
    // 从preview返回到template
    backTemplate ({ commit }) {
      commit('backTemplate')
    },
    async preview ({ commit, state, dispatch }) {
      try {
        const { selectedIndex, templateList } = state
        const template = templateList[selectedIndex]
        const previewTagList = await api.preview(template)
        commit('preview', previewTagList)
      } catch (err) {
        if (err && err.code === 7001) {
          dispatch('refresh')
        } else {
          console.error(err)
          throw err
        }
      }
    },
    async apply ({ dispatch, state }) {
      try {
        const { selectedIndex, templateList } = state
        const template = templateList[selectedIndex]
        const { taskId, sleep } = await api.apply(template)
        dispatch('startTask', { taskId, sleep })
      } catch (err) {
        if (err && err.code === 7001) {
          dispatch('refresh')
        } else {
          console.error(err)
          throw err
        }
      }
    },
    backgroundApply ({ commit }) {
      commit('backgroundApply')
    },
    async retry ({ commit, state, dispatch }) {
      try {
        const { taskId, sleep } = await api.retry(state.taskId)
        commit('retry', { taskId, sleep })
        dispatch('polling')
      } catch (err) {
        if (err && err.code === 7001) {
          message.error('模版已更新，请重新选择分类模版')
        } else {
          console.error(err)
          throw err
        }
      }
    },
    polling ({ commit, state, dispatch }) {
      // 存在合法任务
      if (state.taskId > 0) {
        const timer = setTimeout(async () => {
          try {
            const { result, status, message } = await api.polling(state.taskId)
            // status 0-处理中,1-已完成,2-处理失败
            // result 1-成功，2-失败
            if (status === 0) {
              dispatch('polling')
              return
            }
            if (status === 1 && result === 1) {
              commit('success', message)
              return
            }
            commit('fail', message)
          } catch (err) {
            console.error(err)
          }
        }, state.sleep)
        commit('timer', timer)
      } else {
        clearTimeout(state.timer)
      }
    },
    refresh ({ commit, dispatch }) {
      message.warning('模版已更新，马上为您呈现最新版，请稍后')
      setTimeout(() => {
        commit('refresh')
        dispatch('getOptions')
      }, 3000)
    },
    cancelPolling ({ commit, state }) {
      clearTimeout(state.timer)
      commit('timer', null)
    },
    fetchPreviewProduct (_context, params) {
      return api.getProductList(params.query, params.pagination, params.statusList)
    }
  }
})
