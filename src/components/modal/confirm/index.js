import Modal from './confirm'
import createPopper from '@/hoc/withCreatePopper'

let modalPool = []
const poolMax = 4

const getInstance = (options) => {
  let instance
  if (modalPool.length >= poolMax) {
    instance = modalPool.shift()
  } else {
    instance = createPopper(Modal)
  }
  modalPool.push(instance)
  const node = instance(options)
  return node
}

const baseParams = {
  closable: false,
  maskClosable: false,
  footerHide: false
}
const size = {
  width: 416
}

const open = function (options) {
  const {
    onOk,
    onCancel,
    onClose,
    ...props
  } = options
  const on = {}
  if (onOk) {
    on['on-ok'] = onOk
  }
  if (onCancel) {
    on['on-cancel'] = onCancel
  }
  const instance = getInstance({ props, on })
  return instance
}

const confirm = function (options) {
  return open({ ...baseParams, ...size, ...options, type: 'confirm' })
}
const error = function (options) {
  return open({ ...size, ...options, ...baseParams, showCancel: false, type: 'error' })
}
const warning = function (options) {
  return open({ ...size, ...options, ...baseParams, showCancel: false, type: 'warning' })
}
const success = function (options) {
  return open({ ...size, ...options, ...baseParams, showCancel: false, type: 'success' })
}
const info = function (options) {
  return open({ ...size, ...options, ...baseParams, showCancel: false, type: 'info' })
}
const remove = function () {
  modalPool.forEach(modal => modal && modal.destroy())
  modalPool = []
}

export default {
  open,
  confirm,
  error,
  warning,
  success,
  info,
  remove
}
