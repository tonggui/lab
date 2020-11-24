import Vue from 'vue'
import withCreateInstance from '@/hoc/withCreateInstance'
import Modal from './modal'

let instance = null

const createInstance = withCreateInstance(Vue.extend(Modal))

export default (props, { onClose } = {}) => {
  if (!instance) {
    instance = createInstance({
      ...props,
      value: false
    })
    instance.$nextTick(() => {
      instance.visible = true
    })
  } else {
    instance = createInstance({
      ...props,
      visible: true
    })
  }
  instance.$off('close')

  instance.$on('close', () => {
    instance.visible = false
    onClose && onClose()
  })
  return instance
}