import message from '@/store/modules/helper/toast'
import createTemplateStore from './template'
import createPreviewStore from './preview'

const STATUS = {
  INIT: -1,
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
 * 初始化    不展示      选模版       浏览        应用中       后台运行 应用中       结束（成功/失败）
 * init -> default -> template -> preview -> applying -> background_applying -> fail/success
 */
export default (api) => {
  const templateStoreModule = { namespaced: true, ...createTemplateStore(api) }
  const previewStoreModule = { namespaced: true, ...createPreviewStore(api) }
  return {
    state: {
      loading: false, // 整体loading状态
      error: false, // 整体错误状态
      status: STATUS.INIT, // 分类模版当前进行的状态
      usedBusinessTemplate: false, // TODO 是否已经应用了b端模版
      task: {
        id: null, // 分类模版任务id
        pollingInterval: 5000 // 分类模版
      },
      result: {
        message: '', // 任务成功/失败原因
        classifyStatus: false // 任务成功后是否存在未分类
      },
      timer: null // 轮询的timer
    },
    modules: {
      template: templateStoreModule,
      preview: previewStoreModule
    },
    getters: {
      // 分类模版是否展示中
      // 模版选择和预览的时候是展示中的
      visible (state) {
        return [STATUS.TEMPLATE, STATUS.PREVIEW].includes(state.status)
      },
      // 是否显示应用中的弹框
      showApplying (state) {
        return state.status === STATUS.APPLYING
      },
      // 任务是否成功
      success (state) {
        return state.status === STATUS.SUCCESS
      },
      // 任务是否失败
      fail (state) {
        return state.status === STATUS.FAIL
      },
      classifyStatus (state) {
        return state.result.classifyStatus
      },
      // 任务原因
      message (state) {
        return state.result.message
      },
      showTemplate (state) {
        return state.status === STATUS.TEMPLATE
      },
      showPreview (state) {
        return state.status === STATUS.PREVIEW
      },
      taskApplying (state) {
        return [STATUS.APPLYING, STATUS.BACKGROUND_APPLYING].includes(state.status)
      },
      init (state) {
        return state.status === STATUS.INIT
      }
    },
    mutations: {
      setLoading (state, payload) {
        state.loading = !!payload
      },
      setError (state, payload) {
        state.error = !!payload
      },
      setStatus (state, status) {
        state.status = status
      },
      setTask (state, { id, pollingInterval }) {
        state.task.id = id
        state.task.pollingInterval = pollingInterval
      },
      success (state, { message, classifyStatus }) {
        state.result.message = message
        state.result.classifyStatus = classifyStatus
        state.status = STATUS.SUCCESS
      },
      fail (state, { message }) {
        state.result.message = message
        state.status = STATUS.FAIL
      },
      setTimer (state, timer) {
        state.timer = timer
      },
      setUsedBusinessTemplate (state, usedBusinessTemplate) {
        state.usedBusinessTemplate = usedBusinessTemplate
      }
    },
    actions: {
      async initTask ({ commit, dispatch }) {
        try {
          const { id, pollingInterval } = await api.init()
          if (id > 0) {
            commit('setTask', { id, pollingInterval })
            commit('setStatus', STATUS.BACKGROUND_APPLYING)
            dispatch('polling')
          } else {
            commit('setStatus', STATUS.DEFAULT)
          }
        } catch (err) {
          console.error(err)
          commit('setStatus', STATUS.DEFAULT)
        }
      },
      async getUsedBusinessTemplate ({ commit }) {
        try {
          const { used } = await api.usedBusinessTemplate()
          commit('setUsedBusinessTemplate', !!used)
        } catch (err) {
          console.error(err)
          commit('setUsedBusinessTemplate', false)
        }
      },
      // 初始化
      init ({ dispatch, state }) {
        const { status } = state
        // 初始化状态 说明刚刚加载页面 需要请求看门店是否有正在运行中的任务
        if (status === STATUS.INIT) {
          dispatch('initTask')
          dispatch('getUsedBusinessTemplate')
        } else {
          dispatch('polling')
        }
      },
      // 展开分类模版抽屉
      async show ({ commit, dispatch, state }) {
        if (state.status === STATUS.DEFAULT) {
          commit('setStatus', STATUS.TEMPLATE)
          try {
            commit('setLoading', true)
            await dispatch('template/getOptions')
            commit('setError', false)
          } catch (err) {
            commit('setError', true)
          } finally {
            commit('setLoading', false)
          }
          return
        }
        if (state.status === STATUS.INIT) {
          message.error('分类模版初始化中，请稍后再使用分类模版功能~')
        } else {
          message.error('门店分类自动生成中，请稍后再使用分类模版功能~')
        }
      },
      // 主动关闭分类模版抽屉
      hide ({ commit }) {
        commit('setStatus', STATUS.DEFAULT)
        commit('template/reset')
        commit('preview/reset')
      },
      // 从preview返回到template
      backTemplate ({ commit }) {
        commit('setStatus', STATUS.TEMPLATE)
        commit('preview/reset')
      },
      async preview ({ commit, dispatch, getters }) {
        try {
          const template = getters['template/currentTemplate']
          const previewTagList = await api.preview(template.detail)
          commit('setStatus', STATUS.PREVIEW)
          dispatch('preview/setTagList', previewTagList)
        } catch (err) {
          if (err && err.code === 7001) {
            dispatch('refresh')
          } else {
            console.error(err)
            throw err
          }
        }
      },
      async apply ({ commit, dispatch, getters }) {
        try {
          const template = getters['template/currentTemplate']
          const { id, pollingInterval } = await api.apply(template.detail)
          commit('setTask', { id, pollingInterval })
          commit('setStatus', STATUS.APPLYING)
          dispatch('polling')
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
        commit('setStatus', STATUS.BACKGROUND_APPLYING)
      },
      refresh ({ commit, dispatch }) {
        message.warning('模版已更新，马上为您呈现最新版，请稍后')
        setTimeout(() => {
          commit('setStatus', STATUS.TEMPLATE)
          dispatch('template/getOptions')
        }, 3000)
      },
      polling ({ commit, state, dispatch }) {
        const { id, pollingInterval } = state.task
        // 存在合法任务
        if (id > 0) {
          const timer = setTimeout(async () => {
            try {
              const { result, status, message, classifyStatus } = await api.polling(id)
              // status 0-处理中,1-已完成,2-处理失败
              // result 1-成功,2-失败
              if (status === 0) {
                dispatch('polling')
                return
              }
              if (status === 1 && result === 1) {
                commit('success', { message, classifyStatus })
                dispatch('getUsedBusinessTemplate')
                return
              }
              commit('fail', { message, classifyStatus })
            } catch (err) {
              console.error(err)
            }
          }, pollingInterval)
          commit('setTimer', timer)
        } else {
          clearTimeout(state.timer)
        }
      },
      async retry ({ commit, state, dispatch }) {
        try {
          const { id, pollingInterval } = await api.retry(state.task.id)
          commit('setTask', { id, pollingInterval })
          commit('setStatus', STATUS.BACKGROUND_APPLYING)
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
      cancelPolling ({ commit, state }) {
        clearTimeout(state.timer)
        commit('setTimer', null)
      },
      successBroadcast () {
        // 这个action 主要用于 广播 分类模版成功，没有其他用意
        console.log('success')
      }
    }
  }
}
