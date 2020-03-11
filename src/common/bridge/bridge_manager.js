/*
 * @description
 *   Please write the bridge_manager.js script's description
 * @author
 *   rdshoep (zhangliang15@meituan.com)
 * @version
 *   1.0.0(2020/3/10)
 */
/**
 * mid --- 信令
 * action --- 消息类型
 * data --- 数据
 * error --- 返回结果场景，如果存在error不为空值，表明操作失败
 * */
import _attempt from 'lodash/attempt'

const buildMessageId = () => `product_${Date.now()}_${Math.floor(Math.random() * 100000)}`

export const postMessage = data => parent.postMessage(data, parent.location.origin)

export const sendMessage = (action, data, error = null, mid = buildMessageId()) => postMessage({
  action,
  data,
  error,
  mid
})

const ACTION_HANLDER_MAP = {}

export const registerActionHandler = (action, handler) => {
  if (!ACTION_HANLDER_MAP[action]) {
    ACTION_HANLDER_MAP[action] = new Set()
  }
  ACTION_HANLDER_MAP[action].add(handler)
}

export const unregisterActionHandler = (action, handler) => {
  const handlerSet = ACTION_HANLDER_MAP[action]
  if (handlerSet) {
    handlerSet.delete(handler)
    if (handlerSet.size === 0) {
      delete ACTION_HANLDER_MAP[action]
    }
  }
}

const messageHanlder = event => {
  const origin = event.origin
  if (origin !== location.origin) {
    return
  }
  const { action } = event.data || {}
  if (!action) return

  const handlerSet = ACTION_HANLDER_MAP[action]
  if (handlerSet) {
    const handlerList = Array.from(handlerSet)
    handlerList.forEach(handler => _attempt(handler, event.data))
  }
}

export const setup = () => window.addEventListener('message', messageHanlder, false)

export const destroy = () => window.removeEventListener('message', messageHanlder, false)
