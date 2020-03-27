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
import _endsWith from 'lodash/endsWith'

const buildMessageId = () => `product_${Date.now()}_${Math.floor(Math.random() * 100000)}`

export const postMessage = (data, origin) => {
  console.log('发出消息', data, origin)
  if (!origin) {
    origin = parent.location.origin
  }
  return parent.postMessage(data, origin)
}

export const sendMessage = (action, data, error = null, mid = buildMessageId(), origin) => postMessage({
  action,
  data,
  error,
  mid
}, origin)

const ACTION_HANDLER_MAP = {}

export const registerActionHandler = (action, handler) => {
  if (!ACTION_HANDLER_MAP[action]) {
    ACTION_HANDLER_MAP[action] = new Set()
  }
  ACTION_HANDLER_MAP[action].add(handler)
}

export const unregisterActionHandler = (action, handler) => {
  const handlerSet = ACTION_HANDLER_MAP[action]
  if (handlerSet) {
    handlerSet.delete(handler)
    if (handlerSet.size === 0) {
      delete ACTION_HANDLER_MAP[action]
    }
  }
}

const messageHandler = event => {
  console.log('接收到信息', event)
  const origin = event.origin
  if (
    origin !== location.origin &&
    !_endsWith(origin, '.sankuai.com') &&
    !_endsWith(origin, '.meituan.com')
  ) {
    console.warn(`忽略非信任域名消息（来自：${origin}）: ${event.data}`)
    return
  }
  const { action } = event.data || {}
  if (!action) return

  const handlerSet = ACTION_HANDLER_MAP[action]
  if (handlerSet) {
    const handlerList = Array.from(handlerSet)
    handlerList.forEach(handler => _attempt(handler, [event.data, origin]))
  }
}

export const setup = () => window.addEventListener('message', messageHandler, false)

export const destroy = () => window.removeEventListener('message', messageHandler, false)
