import ModalComponent from './modal'
import withPopper from '@/hoc/withPopper'
import withPromiseEmit from '@/hoc/withPromiseEmit'
import createPopper from '@/hoc/withCreatePopper'

const Modal = withPopper(withPromiseEmit(ModalComponent))

let modalPool = []
const poolMax = 4

const getInstance = (options) => {
  let instance
  if (modalPool.length >= poolMax) {
    instance = modalPool.shift()
  } else {
    instance = createPopper(Modal)
    modalPool.push(instance)
  }
  const node = instance(options)
  return node
}

const baseParams = {
  closable: false,
  maskClosable: false,
  footerHide: false
}

Modal.open = function (options) {
  const {
    content,
    render,
    onOk,
    onCancel,
    renderFooter,
    ...props
  } = options
  const on = {}
  if (onOk) {
    on['on-ok'] = onOk
  }
  if (onCancel) {
    on['on-cancel'] = onCancel
  }
  const scopedSlots = {
    'default': render || (() => content)
  }
  if (renderFooter) {
    scopedSlots.footer = renderFooter
  }
  const instance = getInstance({ props, on, scopedSlots })
  return instance
}

Modal.confirm = function (options) {
  return Modal.open({ ...options, ...baseParams })
}
Modal.error = function (options) {
  return Modal.open({ ...options, ...baseParams, showCancel: false })
}
Modal.warning = function (options) {
  return Modal.open({ ...options, ...baseParams, showCancel: false })
}
Modal.success = function (options) {
  return Modal.open({ ...options, ...baseParams, showCancel: false })
}
Modal.info = function (options) {
  return Modal.open({ ...options, ...baseParams, showCancel: false })
}
Modal.remove = function () {
  modalPool.forEach(modal => modal && modal.destroy())
  modalPool = []
}

export default Modal
