import _get from 'lodash/get'
import _isFunction from 'lodash/isFunction'
import Modal from '@/components/modal'

let workingState = null

const createConfirmModalTitle = (pageName = document.title) => `确定离开${pageName}？`

const convertWorkingStateToDisplayInfo = (state) => {
  return {
    title: _get(state, 'title', createConfirmModalTitle(_get(state, 'pageName'))),
    content: _get(state, 'content', ''),
    okText: _get(state, 'okText', '确定'),
    cancel: _get(state, 'cancel', '取消')
  }
}

const stateChangeWatcher = infoObjOrFunc => function (newVal) {
  if (newVal) {
    setWorkingState(_isFunction(infoObjOrFunc) ? infoObjOrFunc(newVal) : infoObjOrFunc)
  } else {
    setWorkingState(null)
  }
}

/**
 * 命令式，支持复杂场景。利用Vue.$watch监听key或者表达式
 * @param vm
 * @param keyPathOrExpr
 * @param infoObjOrFunc
 */
export const bindStateWatcher = (vm, keyPathOrExpr, infoObjOrFunc) => {
  return vm.$watch(keyPathOrExpr, stateChangeWatcher(infoObjOrFunc))
}

/**
 * 配置式，应用于简单场景下（Key没有其他的监听器）
 */
export const mapStateWatcher = (key, infoObjOrFunc, options = {}) => {
  return {
    [key]: {
      handler: stateChangeWatcher(infoObjOrFunc),
      ...options
    }
  }
}

export const setWorkingState = (state) => {
  workingState = state
}

const beforeEachHook = async (to, from, next) => {
  let prevent = false
  if (workingState) {
    prevent = await new Promise(resolve => {
      Modal.confirm({
        title: createConfirmModalTitle(),
        onOk: () => resolve(false),
        onCancel: () => resolve(true),
        ...convertWorkingStateToDisplayInfo(workingState)
      })
    })
  }

  if (!prevent) {
    setWorkingState(null)
    next()
  }
}

export const install = (vueRouter) => {
  vueRouter.beforeEach(beforeEachHook)
}
